import { test, expect } from '@playwright/test';

/**
 * Consent, and the promise that nothing loads before it.
 *
 * The common pattern is to ship gtag.js on every page and ask permission
 * afterwards, by which point the request, the DNS lookup and usually the
 * cookie have already happened. These tests assert the opposite, at the only
 * level that cannot be faked: actual network requests and actual cookies.
 */

const isGoogle = (url: string) => /google|gtag|doubleclick/.test(new URL(url).hostname);

test.describe('cookie consent', () => {
  test('a first visit loads nothing and sets nothing', async ({ page, context }) => {
    const calls: string[] = [];
    page.on('request', (r) => isGoogle(r.url()) && calls.push(r.url()));

    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('#cookie')).toBeVisible();
    await page.waitForTimeout(600);

    expect(calls, 'third-party requests before consent').toEqual([]);
    expect(await context.cookies(), 'cookies before consent').toEqual([]);
  });

  test('refusing leaves the site exactly as it was', async ({ page, context }) => {
    const calls: string[] = [];
    page.on('request', (r) => isGoogle(r.url()) && calls.push(r.url()));

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.click('[data-consent=no]');
    await page.waitForTimeout(800);

    expect(calls).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    // And it does not ask again on the next page.
    await page.goto('/about/');
    await expect(page.locator('#cookie')).toBeHidden();
  });

  test('allowing loads analytics, and the CSP permits it', async ({ page }) => {
    const csp: string[] = [];
    let loaded = false;
    page.on('request', (r) => {
      if (r.url().includes('googletagmanager.com/gtag/js')) loaded = true;
    });
    page.on('console', (m) => {
      if (m.type() === 'error' && /Content Security Policy/i.test(m.text())) csp.push(m.text());
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.click('[data-consent=yes]');
    await page.waitForResponse((r) => isGoogle(r.url()), { timeout: 10_000 });
    await page.waitForTimeout(1200);

    // Asserted on the network rather than on cookies: the GA cookie carries
    // `Secure`, and WebKit refuses Secure cookies over the plain HTTP the test
    // server speaks. The request is the thing that proves analytics loaded,
    // and it behaves the same in both engines.
    expect(loaded, 'gtag.js did not load after consent').toBe(true);

    // gtag.js and the beacons both need explicit CSP origins, and both fail
    // silently in production if they are missing.
    expect(csp, 'CSP blocked analytics').toEqual([]);
  });

  test('the choice can be changed from /privacy/', async ({ page }) => {
    // An answer you cannot revisit is not a choice, it is a click somebody
    // funnelled you into.
    await page.goto('/');
    await page.click('[data-consent=yes]');
    await page.goto('/privacy/');
    await expect(page.locator('#consentNow')).toContainText('allowed');

    await page.click('#consentReset');
    await expect(page.locator('#consentNow')).toContainText('ask again');

    await page.goto('/');
    await expect(page.locator('#cookie')).toBeVisible();
  });

  test('refusing is as easy as accepting', async ({ page }) => {
    // A grey "reject" next to a black "accept" is a dark pattern with better
    // manners. Same size, same shape, same row.
    await page.goto('/');
    // Measured after the banner has stopped moving, not during.
    //
    // It slides up over 400ms. The two boxes are read one after the other, so
    // mid-transition the banner travels a fraction of a pixel between the two
    // reads and the y comparison fails on a threshold of 2px — a test that
    // passed alone and failed in a full run, which is the signature of timing
    // rather than layout. Waiting on the animation is exact where a sleep is
    // a guess.
    const banner = page.locator('#cookie');
    await expect(banner).toBeVisible();
    await banner.evaluate((el) =>
      Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})))
    );
    const yes = await page.locator('[data-consent=yes]').boundingBox();
    const no = await page.locator('[data-consent=no]').boundingBox();
    expect(Math.abs(yes!.width - no!.width)).toBeLessThan(4);
    expect(Math.abs(yes!.height - no!.height)).toBeLessThan(2);
    expect(Math.abs(yes!.y - no!.y)).toBeLessThan(2);
  });
});

test.describe('the banner and the page it sits on', () => {
  for (const [w, h, name] of [[390, 800, 'phone'], [320, 700, 'small phone'], [1280, 900, 'desktop']] as const) {
    test(`does not cover the theme toggle on ${name}`, async ({ page }) => {
      // The banner is full width on a phone, so the bottom corner the toggle
      // used to have simply stops existing. The offset is measured from the
      // rendered banner rather than hardcoded, because the height moves with
      // the copy.
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await expect(page.locator('#cookie')).toBeVisible();

      const c = (await page.locator('#cookie').boundingBox())!;
      const t = (await page.locator('.theme-toggle').boundingBox())!;
      const overlap =
        c.x < t.x + t.width && t.x < c.x + c.width && c.y < t.y + t.height && t.y < c.y + c.height;
      expect(overlap, 'banner covers the theme toggle').toBe(false);
    });
  }
});
