import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';

/** Every URL the site promises to serve, read from the contract itself. */
const src = readFileSync('src/lib/site.ts', 'utf8');
const section = (name: string) => {
  const m = src.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};
const URLS = [...section('pages'), ...section('tools'), ...section('writing')];

test('the URL contract is not empty', () => {
  expect(URLS.length).toBeGreaterThan(20);
});

test.describe('every page', () => {
  for (const url of URLS) {
    test(`${url} is healthy`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));

      const res = await page.goto(url);
      expect(res?.status(), 'HTTP status').toBe(200);

      // Exactly one h1. More than one is an outline bug; none is worse.
      await expect(page.locator('h1')).toHaveCount(1);

      // Head essentials — these are what break silently.
      await expect(page.locator('title')).toHaveCount(1);
      const desc = await page.locator('meta[name=description]').getAttribute('content');
      expect(desc?.length ?? 0, 'meta description length').toBeGreaterThan(60);
      await expect(page.locator('link[rel=canonical]')).toHaveCount(1);

      // The declared social card must actually exist. It did not for weeks:
      // every page announced /og-default.png and the file was never created.
      const og = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(og, 'og:image declared').toBeTruthy();
      const ogRes = await page.request.get(new URL(og!).pathname);
      expect(ogRes.status(), `og:image ${og}`).toBe(200);

      // Chrome and footer are present. This is the check that would have
      // caught the newsletter band disappearing from /map/.
      //
      // The brief is the one page without either, on purpose: it is a
      // full-screen form, and every link in a header is an invitation to
      // abandon it. It gets a close control instead, which is checked here so
      // "no chrome" cannot quietly become "no way out".
      if (url === '/work-with-me/brief/') {
        await expect(page.locator('header.site-header')).toHaveCount(0);
        await expect(page.locator('footer.site-footer')).toHaveCount(0);
        await expect(page.locator('a.close[href="/work-with-me/"]')).toBeVisible();
      } else {
        await expect(page.locator('header.site-header')).toBeVisible();
        await expect(page.locator('footer.site-footer')).toBeVisible();
      }

      expect(errors, 'console errors').toEqual([]);
    });
  }
});

test.describe('structured data', () => {
  for (const url of ['/', '/work-with-me/', '/tools/', '/map/', '/writing/']) {
    test(`${url} emits valid JSON-LD`, async ({ page }) => {
      await page.goto(url);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
    });
  }
});

test('the map is usable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/map/');

  // It used to be display:none below 760px, which removed the page's whole
  // point from most visits.
  const diagram = page.locator('.diagram');
  await expect(diagram).toBeVisible();

  // All five stops, each a real link, each description readable without hover.
  await expect(page.locator('.stop')).toHaveCount(5);
  await expect(page.locator('.stop a')).toHaveCount(5);
  await expect(page.locator('.stop .peek').first()).toBeVisible();

  // Touch targets.
  const dot = await page.locator('.dot').first().boundingBox();
  expect(dot!.height).toBeGreaterThanOrEqual(44);

  // And nothing spills sideways.
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  ).toBe(false);
});

test('no horizontal scroll at any breakpoint', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/map/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow, `overflow at ${width}px`).toBe(false);
  }
});

test.describe('the tools actually work', () => {
  test('a check runs to a verdict and back', async ({ page }) => {
    await page.goto('/tools/why-is-nobody-using-your-product/');

    await expect(page.locator('.qq')).toBeVisible();
    for (let i = 0; i < 3; i++) await page.locator('.opt').first().click();

    await expect(page.locator('.vname')).toBeVisible();
    await expect(page.getByText('What I would do next')).toBeVisible();

    await page.getByRole('button', { name: 'Run it again' }).click();
    await expect(page.locator('.qq')).toBeVisible();
  });

  test('a result has its own URL and can be reopened', async ({ page }) => {
    await page.goto('/tools/why-is-nobody-using-your-product/');
    for (let i = 0; i < 3; i++) await page.locator('.opt').first().click();

    const verdict = await page.locator('.vname').textContent();
    expect(page.url()).toContain('#a=');

    // The whole point: send that URL to somebody and they see the same answer.
    await page.goto(page.url());
    expect(await page.locator('.vname').textContent()).toBe(verdict);
  });

  test('the browser back button walks back through the questions', async ({ page }) => {
    await page.goto('/tools/why-is-nobody-using-your-product/');
    await page.locator('.opt').first().click();
    await page.locator('.opt').first().click();
    await expect(page.locator('.eyebrow').first()).toContainText('Question 3');

    await page.goBack();
    await expect(page.locator('.eyebrow').first()).toContainText('Question 2');
    await page.goBack();
    await expect(page.locator('.eyebrow').first()).toContainText('Question 1');
  });

  test('a tampered hash does not break the page', async ({ page }) => {
    await page.goto('/tools/why-is-nobody-using-your-product/#a=99,abc,-4');
    // Out-of-range answers are dropped rather than scoring nonsense.
    await expect(page.locator('.qq')).toBeVisible();
  });

  test('going back does not inflate the score', async ({ page }) => {
    await page.goto('/tools/why-is-nobody-using-your-product/');
    await page.locator('.opt').first().click();
    await page.getByRole('button', { name: /← Back/ }).click();
    await page.locator('.opt').first().click();
    await page.locator('.opt').first().click();
    await page.locator('.opt').first().click();
    // Answering A,A,A after a back-and-forth must give the same verdict as a
    // clean run. Before the fix, the abandoned answer stayed in the score.
    const withBack = await page.locator('.vname').textContent();

    await page.goto('/tools/why-is-nobody-using-your-product/');
    for (let i = 0; i < 3; i++) await page.locator('.opt').first().click();
    expect(await page.locator('.vname').textContent()).toBe(withBack);
  });
});

test.describe('the answer gets a reaction', () => {
  // Scores for "why is nobody using your product":
  //   Q1 [4,3,1,0] · Q2 [0,2,4] · Q3 [0,2,4]
  // so the options are not ordered best-to-worst and picking .first()
  // three times lands in the middle, not on the good news.
  test('the best outcome celebrates', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/tools/why-is-nobody-using-your-product/');
    await page.locator('.opt').last().click();   // 0
    await page.locator('.opt').first().click();  // 0
    await page.locator('.opt').first().click();  // 0 → first bucket
    await expect(page.locator('.vname')).toContainText('came back');
    await expect(page.locator('canvas')).toBeAttached();
  });

  test('the worst outcome settles instead', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/tools/why-is-nobody-using-your-product/');
    await page.locator('.opt').first().click();  // 4
    await page.locator('.opt').last().click();   // 4
    await page.locator('.opt').last().click();   // 4 → last bucket
    await expect(page.locator('.vname')).toContainText('did not need it');
    await expect(page.locator('canvas')).toBeAttached();
  });

  test('nothing animates when motion is reduced', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/why-is-nobody-using-your-product/');
    await page.locator('.opt').last().click();
    await page.locator('.opt').first().click();
    await page.locator('.opt').first().click();
    await expect(page.locator('.vname')).toBeVisible();
    expect(await page.locator('canvas').count()).toBe(0);
  });

  test('a rejection from the qualifier does not celebrate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/work-with-me/');
    // All four questions are always asked; decide() runs at the end.
    // 'do' on question two — "somebody to execute a plan we have agreed" —
    // is the answer that routes to 'nope'.
    await page.locator('.opt').first().click();
    await page.locator('.opt').last().click();
    await page.locator('.opt').first().click();
    await page.locator('.opt').first().click();
    await expect(page.locator('.vname')).toContainText('Not me');
    await expect(page.locator('canvas')).toBeAttached();
  });
});

test('the qualifier reaches a recommendation', async ({ page }) => {
  await page.goto('/work-with-me/');
  for (let i = 0; i < 4; i++) await page.locator('.opt').first().click();
  await expect(page.locator('.vname')).toBeVisible();
  await expect(page.getByText('What you would get')).toBeVisible();
});


/**
 * Advance the brief one step, and wait for the step to actually be there.
 *
 * Each Continue repaints the panel and rebinds its handlers, so under parallel
 * load a click could land on a button that had just been replaced and do
 * nothing — the test then failed one run in twenty, and only on mobile WebKit.
 * Asserting the stepper moved is both the wait and the assertion.
 */
async function nextStep(page: import('@playwright/test').Page, to: number) {
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#stepper li[data-state=now]')).toHaveAttribute('data-step', String(to));
}

test('the brief refuses to submit without an email', async ({ page }) => {
  // Its own page now: it is only reachable from a positive verdict, so nobody
  // fills in three minutes of form before finding out none of it applies.
  await page.goto('/work-with-me/brief/');
  await page.getByRole('button', { name: 'Start' }).click();
  await nextStep(page, 2);

  // Step 3 is now gated on the way out of it, so you cannot reach step 5 and
  // then be told about step 3 with no way back.
  await nextStep(page, 3);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.formErr')).toContainText('I actually read');
  await expect(page.locator('#stepper li[data-state=now]')).toHaveAttribute('data-step', '3');

  await page.locator('#b4').fill('The launch went quiet and nobody can agree on why.');
  await nextStep(page, 4);
  await nextStep(page, 5);

  // And the email is caught where the email is.
  await page.getByRole('button', { name: 'Send the brief' }).click();
  await expect(page.locator('.formErr')).toContainText('email address that works');
  await expect(page.locator('#stepper li[data-state=now]')).toHaveAttribute('data-step', '5');
});

test('the brief carries the verdict across, and the stepper tracks it', async ({ page }) => {
  await page.goto('/work-with-me/brief/?rec=review');

  // Step 0 is context only: the verdict, the time it takes, what happens next.
  // Nothing is asked yet, so no step is marked current.
  await expect(page.getByText('Based on your answers: A product review')).toBeVisible();
  await expect(page.locator('#stepper li[data-state=now]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.locator('input[name=kind][data-k=review]')).toBeChecked();
  await expect(page.locator('#stepper li[data-state=now]')).toHaveAttribute('data-step', '1');
  await nextStep(page, 2);
  await expect(page.locator('#stepper li[data-step="1"]')).toHaveAttribute('data-state', 'done');

  // Going back must not lose what was typed.
  await page.locator('#b1').fill('example.com');
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.locator('#stepper li[data-state=now]')).toHaveAttribute('data-step', '1');
  await nextStep(page, 2);
  await expect(page.locator('#b1')).toHaveValue('example.com');
});

test('a positive verdict is the only route to the brief', async ({ page }) => {
  await page.goto('/work-with-me/');
  // The old page carried the whole form below the fold, so anybody could fill
  // it in without ever being told none of it applied to them.
  await expect(page.locator('#bBox')).toHaveCount(0);
  for (let i = 0; i < 4; i++) await page.locator('.opt').first().click();
  await expect(page.locator('.vacts a[href^="/work-with-me/brief/"]')).toBeVisible();
});

test.describe('the journal', () => {
  const PAGE = 6;

  test('shows at most six, and the button only exists when there are more', async ({ page }) => {
    await page.goto('/writing/');
    const total = await page.locator('.row').count();
    const visible = await page.locator('.row:visible').count();

    expect(visible).toBe(Math.min(PAGE, total));

    const more = page.getByRole('button', { name: /Show \d+ more/ });
    if (total > PAGE) {
      await expect(more).toBeVisible();
      await more.click();
      await expect(async () => {
        expect(await page.locator('.row:visible').count()).toBeGreaterThan(visible);
      }).toPass();
    } else {
      // No button, and nothing hidden with nothing to reveal.
      await expect(more).toHaveCount(0);
      expect(visible).toBe(total);
    }
  });

  test('every published essay is in the HTML before any clicking', async ({ page }) => {
    await page.goto('/writing/');
    const rows = await page.locator('.row').count();
    expect(rows).toBeGreaterThan(0);
    // Each row is a real link to a page that exists.
    for (const href of await page.locator('.row a').evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute('href'))
    )) {
      expect((await page.request.get(href!)).status()).toBe(200);
    }
  });
});

test('the mobile menu traps focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('.burger').click();
  await expect(page.locator('.sheet')).toBeVisible();

  // Background must be inert, or Tab walks the page underneath.
  expect(await page.locator('main').evaluate((el) => (el as HTMLElement).inert)).toBe(true);

  // There must be a visible way out that is not a keyboard shortcut.
  const close = page.locator('#sheet-close');
  await expect(close).toBeVisible();
  const box = await close.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  await close.click();
  await expect(page.locator('.sheet')).not.toBeVisible();

  // And Escape still works.
  await page.locator('.burger').click();
  await expect(page.locator('.sheet')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).not.toBeVisible();
  expect(await page.locator('main').evaluate((el) => (el as HTMLElement).inert)).toBe(false);
});

test('required public files exist', () => {
  for (const f of [
    'dist/robots.txt',
    'dist/.htaccess',
    'dist/api/brief.php',
    'dist/api/log.php',
    'dist/_redirects',
    'dist/favicon.svg',
    'dist/site.webmanifest',
    'dist/rss.xml',
    'dist/sitemap-index.xml',
    'dist/404.html',
    'dist/llms.txt',
    'dist/llms-full.txt',
  ]) {
    expect(existsSync(f), f).toBe(true);
  }
});

test('js errors are reported, and the page survives reporting', async ({ page }) => {
  await page.goto('/');

  // Spy inside the page rather than on the network: WebKit does not expose a
  // sendBeacon body to route interception, so intercepting proves nothing.
  const payload = await page.evaluate(async () => {
    return new Promise<string>((resolve) => {
      const real = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = (url, data) => {
        if (String(url).includes('/api/log.php') && data instanceof Blob) {
          data.text().then(resolve);
          return true;
        }
        return real(url, data as BodyInit);
      };
      window.dispatchEvent(
        new ErrorEvent('error', { message: 'test failure', filename: 'x.js', lineno: 7 })
      );
    });
  });

  const body = JSON.parse(payload);
  expect(body.message).toContain('test failure');
  expect(body.line).toBe(7);
  // Nothing in here can identify a person.
  expect(Object.keys(body).sort()).toEqual(['line', 'message', 'page', 'source']);
});

test('the styleguide exists but stays out of search', async ({ page }) => {
  const res = await page.goto('/styleguide/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);

  const sitemap = await (await page.request.get('/sitemap-0.xml')).text();
  expect(sitemap).not.toContain('/styleguide/');

  // It must render the real components, not copies of them. Scoped to the
  // page body: the first .btn--dark in the DOM is the header CTA, which is
  // hidden below 820px.
  const sg = page.locator('.sg');
  await expect(sg.locator('.card-link').first()).toBeVisible();
  await expect(sg.locator('.btn--dark').first()).toBeVisible();
  await expect(sg.locator('.opt').first()).toBeVisible();

  // Contrast is computed live; nothing should be failing AA.
  const failing = await page.locator('[data-fail="true"]').count();
  expect(failing, 'tokens failing WCAG AA').toBe(0);
});

test('no grey placeholder survives in production', async ({ page }) => {
  await page.goto('/');
  // The wide slot on the home used to be an empty div.
  await expect(page.locator('.wide-shot')).toBeVisible();
  await page.goto('/about/');
  const portrait = page.locator('img.portrait');
  await expect(portrait).toBeVisible();
  expect(await portrait.getAttribute('alt')).toBeTruthy();
});

test('the Person entity is complete enough to be reconciled', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = blocks.flatMap((b) => JSON.parse(b)['@graph'] ?? []);
  const person = graph.find((n: any) => n['@type'] === 'Person');

  expect(person, 'Person node').toBeTruthy();
  // sameAs is how a search engine matches the name to a known person rather
  // than treating it as a string. Empty links used to render as nothing.
  expect(person.sameAs?.length).toBeGreaterThanOrEqual(2);
  for (const url of person.sameAs) expect(url).toMatch(/^https:\/\//);
  expect(person.knowsAbout?.length).toBeGreaterThanOrEqual(5);
  expect(person.description?.length).toBeGreaterThan(60);
});

test('the legal notice is reachable from every page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a[href="/legal/"]')).toBeVisible();
  await expect(page.locator('footer a[href="/privacy/"]')).toBeVisible();
});

test('llms.txt describes the site as it currently is', async ({ page }) => {
  const res = await page.request.get('/llms.txt');
  expect(res.status()).toBe(200);
  const txt = await res.text();

  // Generated, not hand-written — so it must contain today's content, and no
  // unresolved template placeholders.
  expect(txt).toContain('Sergio Gualda');
  expect(txt).toContain('/llms-full.txt');
  expect(txt).not.toContain('${');

  const full = await (await page.request.get('/llms-full.txt')).text();
  expect(full.length).toBeGreaterThan(50_000);
  expect(full).not.toContain('${');
  // The diagnoses that are otherwise trapped inside the JS bundle.
  expect(full).toContain('They did not need it');
  expect(full).toContain('That was a polite no');
});

test('every redirect target resolves', async ({ page }) => {
  const rules = readFileSync('dist/_redirects', 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/)[1])
    .filter((to) => to?.startsWith('/'));

  for (const to of new Set(rules)) {
    const res = await page.goto(to);
    expect(res?.status(), `redirect target ${to}`).toBe(200);
  }
});

test('the brief has no theme toggle, and one way out', async ({ page }) => {
  // A focused screen with a floating control in the corner is not focused, and
  // on a phone it landed on top of the last option.
  await page.goto('/work-with-me/brief/');
  await expect(page.locator('.theme-toggle')).toBeHidden();
  await expect(page.locator('a.close')).toBeVisible();
});

test('a failing brief endpoint says something a person can act on', async ({ page }) => {
  // The endpoint is PHP. When it is misconfigured it answers with an HTML error
  // page, and parsing that as JSON used to surface "Unexpected token '<'" to
  // somebody who just wanted to send a message.
  await page.route('**/api/brief.php', (route) =>
    route.fulfill({ status: 500, contentType: 'text/html', body: '<!DOCTYPE html><h1>500</h1>' })
  );
  await page.goto('/work-with-me/brief/');
  await page.getByRole('button', { name: 'Start' }).click();
  await nextStep(page, 2);
  await nextStep(page, 3);
  // Step 3 is the one that is actually validated, so it has to be filled in
  // before the network error is the thing under test.
  await page.locator('#b4').fill('The launch went quiet and nobody can agree on why.');
  await nextStep(page, 4);
  await nextStep(page, 5);

  await page.locator('#b10').fill('someone@example.com');
  await page.getByRole('button', { name: 'Send the brief' }).click();

  const err = page.locator('.formErr');
  await expect(err).toBeVisible();
  await expect(err).toContainText('hello@sgualda.com');
  await expect(err).not.toContainText('JSON');
});

test('the removed topic hubs redirect rather than 404', async ({ page }) => {
  // Five pages deleted, not hidden. The rule is only in .htaccess, which the
  // static preview server does not read — so this checks the contract itself:
  // every old URL has a rule, and it points somewhere that exists.
  const rules = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');
  for (const slug of ['craft', 'discovery', 'measurement', 'process', 'scope']) {
    expect(rules).toContain(`/writing/topic/${slug}/`);
  }
  const res = await page.goto('/writing/');
  expect(res?.status()).toBe(200);
});

test('the glossary filter narrows the list, and only exists with JavaScript', async ({ page }) => {
  await page.goto('/glossary/');
  await expect(page.locator('.find')).toBeVisible();
  const total = await page.locator('.term').count();

  await page.fill('#q', 'polite');
  await expect(page.locator('.term:visible')).not.toHaveCount(total);
  await expect(page.locator('#count')).toContainText(`of ${total}`);

  await page.fill('#q', '');
  await expect(page.locator('.term:visible')).toHaveCount(total);
});

test('no page title is truncated by Google', async ({ page }) => {
  // The site name is appended only when it fits. Eight pages were losing the
  // end of the real title purely to carry a 16-character suffix.
  for (const url of ['/', '/work-with-me/', '/community/', '/map/worth-building/', '/tools/why-is-nobody-using-your-product/']) {
    await page.goto(url);
    expect((await page.title()).length, `title length on ${url}`).toBeLessThanOrEqual(60);
  }
});

test('the brief offers a way home, not only a way back', async ({ page }) => {
  await page.goto('/work-with-me/brief/');
  await expect(page.locator('a.home[href="/"]')).toBeVisible();
  await expect(page.locator('a.close[href="/work-with-me/"]')).toBeVisible();
});

test.describe('the funnel', () => {
  // Five of the seven page types used to end without offering anything, and
  // they are the ones a stranger lands on. This is the check that stops that
  // happening again silently.
  const ENTRY_POINTS = [
    '/about/',
    '/glossary/',
    '/community/',
    '/writing/mvp-vs-prototype/',
    '/tools/why-is-nobody-using-your-product/',
    '/case-studies/truvi/',
    '/map/nobody-came/',
  ];

  for (const url of ENTRY_POINTS) {
    test(`${url} offers a route to the brief`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('main a[href="/work-with-me/"]').first()).toBeVisible();
    });
  }

  test('nothing on the site asks for a call', async ({ page }) => {
    // The model is contactless: a brief, then an email. "First call is 20
    // minutes" survived on /case-studies/ for days after the button above it
    // had already been changed.
    for (const url of ['/', '/work-with-me/', '/case-studies/', '/work-with-me/brief/']) {
      await page.goto(url);
      const text = (await page.locator('main').innerText()).toLowerCase();
      expect(text, `${url} promises a call`).not.toMatch(/book a call|first call is|schedule a call/);
    }
  });

  test('the brief says where the email goes, and survives a reload', async ({ page }) => {
    await page.goto('/work-with-me/brief/');
    await page.getByRole('button', { name: 'Start' }).click();
    await nextStep(page, 2);
    await page.locator('#b1').fill('example.com');
    await nextStep(page, 3);
    await page.locator('#b4').fill('The launch went quiet and nobody agrees why.');
    await nextStep(page, 4);
    await nextStep(page, 5);

    // The commonest silent objection to a form is not knowing what happens to
    // the address, answered where the address is asked for.
    await expect(page.locator('.privacy a[href="/privacy/"]')).toBeVisible();

    // Closing the tab used to lose everything. Going back already survived.
    await page.reload();
    await page.getByRole('button', { name: 'Start' }).click();
    await nextStep(page, 2);
    await expect(page.locator('#b1')).toHaveValue('example.com');
  });

  test('the success page commits to a date, not to "soon"', async ({ page }) => {
    await page.goto('/work-with-me/brief/sent/');
    await expect(page.locator('#when')).toBeVisible();
    await expect(page.locator('#when')).toContainText('spam');
  });
});

test.describe('the sitemap', () => {
  const xml = () => readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');

  test('never announces a page that tells crawlers not to index it', async () => {
    // /work-with-me/brief/ was in the sitemap and carried noindex at the same
    // time. Two opposite instructions for one URL is a reason to trust the
    // whole file less, not just that entry.
    expect(xml()).not.toContain('/work-with-me/brief/');
  });

  test('every URL carries a lastmod, and none carries priority', async () => {
    const locs = xml().match(/<loc>/g)?.length ?? 0;
    const mods = xml().match(/<lastmod>/g)?.length ?? 0;
    expect(locs).toBeGreaterThan(30);
    expect(mods).toBe(locs);
    // Google has ignored priority for years, and it was set on 15 of 38.
    expect(xml()).not.toContain('<priority>');
  });

  test('content dates are the real ones, not the build date', async () => {
    // An essay revised in March must say March. If everything says today, the
    // signal is worthless — it claims the whole site changed every build.
    const today = new Date().toISOString().slice(0, 10);
    const dates = [...xml().matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]);
    expect(new Set(dates).size).toBeGreaterThan(1);
    expect(dates.filter((d) => d !== today).length).toBeGreaterThan(5);
  });
});

test('every map stage answers three questions directly', async ({ page }) => {
  // The stage pages were the longest thing on the site with no block of
  // answered questions — the format that feeds People Also Ask.
  for (const slug of ['worth-building', 'first-version', 'nobody-came', 'make-it-repeatable', 'charging-for-it']) {
    await page.goto(`/map/${slug}/`);
    await expect(page.locator('.faq details')).toHaveCount(3);
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ld, `${slug} FAQPage`).toContain('FAQPage');
  }
});

test('no two pages chase the same query in their title', async ({ page }) => {
  // The five map stages all read "Stage 0N: {name} — building a product",
  // which competes with itself four times and targets a phrase — "stage 03" —
  // that nobody searches. Rewriting them created one new collision with the
  // checks, so this compares the two families against each other.
  const titles = new Map<string, string>();
  for (const url of [
    '/map/worth-building/', '/map/first-version/', '/map/nobody-came/',
    '/map/make-it-repeatable/', '/map/charging-for-it/',
    '/tools/is-this-feature-worth-building/', '/tools/why-is-nobody-using-your-product/',
    '/tools/why-your-team-keeps-redoing-the-same-work/', '/tools/can-you-charge-for-your-product-yet/',
  ]) {
    await page.goto(url);
    titles.set(url, (await page.title()).replace(/ \| Sergio Gualda$/, '').toLowerCase());
  }
  const seen = [...titles.values()];
  expect(new Set(seen).size, 'duplicate titles').toBe(seen.length);

  // And no title is a substring of another, which is how two pages end up on
  // the same result and split the clicks.
  for (const a of seen)
    for (const b of seen)
      if (a !== b) expect(b.includes(a), `"${b}" contains "${a}"`).toBe(false);
});

test('/about/ is a proper author page', async ({ page }) => {
  await page.goto('/about/');
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  // ProfilePage is what Google documents for an author page; AboutPage
  // describes an organisation, which this is not.
  expect(ld).toContain('ProfilePage');
  // The questions people type about a person, answered in one place.
  await expect(page.locator('.facts dt')).toHaveCount(5);
});

test('one label for the primary action, everywhere', async ({ page }) => {
  // Six labels had accumulated for /work-with-me/, then two, now one. The
  // guard in check-prose.mjs allows up to two; this pins it at one, because
  // recognition is the only advantage a CTA has on a site this size.
  const labels = new Set<string>();
  for (const url of ['/', '/about/', '/glossary/', '/community/', '/case-studies/', '/map/nobody-came/', '/writing/mvp-vs-prototype/']) {
    await page.goto(url);
    for (const t of await page.locator('main a.btn[href="/work-with-me/"]').allInnerTexts()) {
      labels.add(t.trim());
    }
  }
  expect([...labels]).toEqual(['Hire me']);
});

test('no page violates its own Content Security Policy', async ({ page }) => {
  // The server under test sends the real CSP, so a blocked inline script shows
  // up as a console error here rather than on production. Four of them did:
  // the theme restore, the error logger, the mobile menu and the theme toggle.
  const violations: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && /Content Security Policy/i.test(m.text())) violations.push(m.text());
  });
  for (const url of ['/', '/tools/', '/work-with-me/', '/work-with-me/brief/', '/glossary/', '/community/']) {
    await page.goto(url, { waitUntil: 'networkidle' });
  }
  expect(violations).toEqual([]);
});

test('the mobile menu opens under the production CSP', async ({ page }) => {
  // The single most user-visible consequence of the blocked scripts: on a
  // phone, with no CSP in tests and a CSP in production, navigation simply
  // did not work and nothing said so.
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await page.click('.burger');
  await expect(page.locator('.sheet')).toBeVisible();
  await expect(page.locator('.sheet-links a').first()).toBeVisible();
});
