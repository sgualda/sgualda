import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';

/** Every URL the site promises to serve, read from the contract itself. */
const src = readFileSync('src/lib/site.ts', 'utf8');
const section = (name: string) => {
  const m = src.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};
const URLS = [...section('pages'), ...section('tools'), ...section('topics'), ...section('writing')];

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
      await expect(page.locator('header.site-header')).toBeVisible();
      await expect(page.locator('footer.site-footer')).toBeVisible();

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

test('the brief refuses to submit without an email', async ({ page }) => {
  await page.goto('/work-with-me/#brief');
  for (let i = 2; i <= 5; i++) {
    await page.getByRole('button', { name: 'Continue' }).click();
  }
  await page.getByRole('button', { name: 'Send the brief' }).click();
  await expect(page.locator('.formErr')).toBeVisible();
});

test.describe('the journal', () => {
  test('shows six and loads six more', async ({ page }) => {
    await page.goto('/writing/');
    await expect(page.locator('.row:visible')).toHaveCount(6);

    await page.getByRole('button', { name: /Show \d+ more/ }).click();
    await expect(page.locator('.row:visible').first()).toBeVisible();
    await expect(async () => {
      expect(await page.locator('.row:visible').count()).toBeGreaterThan(6);
    }).toPass();
  });

  test('every essay is in the HTML before any clicking', async ({ page }) => {
    await page.goto('/writing/');
    // Hidden, but present — this is what keeps the archive indexable.
    expect(await page.locator('.row').count()).toBeGreaterThanOrEqual(13);
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
