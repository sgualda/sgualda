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

  test('going back does not inflate the score', async ({ page }) => {
    await page.goto('/tools/why-is-nobody-using-your-product/');
    await page.locator('.opt').first().click();
    await page.getByRole('button', { name: /Back/ }).click();
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

  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).not.toBeVisible();
  expect(await page.locator('main').evaluate((el) => (el as HTMLElement).inert)).toBe(false);
});

test('required public files exist', () => {
  for (const f of [
    'dist/robots.txt',
    'dist/.htaccess',
    'dist/api/brief.php',
    'dist/_redirects',
    'dist/favicon.svg',
    'dist/site.webmanifest',
    'dist/rss.xml',
    'dist/sitemap-index.xml',
    'dist/404.html',
  ]) {
    expect(existsSync(f), f).toBe(true);
  }
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
