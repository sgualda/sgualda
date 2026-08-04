import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Answer the consent banner before touching anything else, which is what a
 * real visitor does. Left open it is a dialog sitting over the bottom of every
 * page, and these tests are about the theme, not about the banner.
 */
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('consent', 'no'); } catch {}
  });
});

/**
 * Dark mode (#Q-026).
 *
 * A second theme doubles the number of colour pairs on the site, and every
 * one of them is a chance to ship unreadable text. These are the assertions
 * that the pairs hold — measured by axe on the rendered page rather than
 * calculated from the token file, because what matters is what a browser
 * actually composited.
 */

const PAGES = ['/', '/tools/why-is-nobody-using-your-product/', '/writing/mvp-vs-prototype/', '/work-with-me/'];

test.describe('theme', () => {
  test('follows the system preference with no stored choice', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(19, 17, 17)');

    await page.emulateMedia({ colorScheme: 'light' });
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
      'rgb(255, 255, 255)'
    );
  });

  test('the toggle overrides the system in both directions', async ({ page }) => {
    // The hard case: system says dark, the person wants light. A theme built
    // only on the media query cannot express this.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
      'rgb(255, 255, 255)'
    );

    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('the choice survives a navigation, and paints correctly first time', async ({ page }) => {
    await page.goto('/');
    await page.click('#theme-toggle');
    await page.goto('/tools/');
    // Read before any script beyond the blocking one could have run. If this
    // is white, the page flashed.
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
      'rgb(19, 17, 17)'
    );
  });

  test('the control says what it does, in both states', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const btn = page.locator('#theme-toggle');
    await expect(btn).toHaveAttribute('aria-label', 'Switch to dark theme');
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-label', 'Switch to light theme');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  test('the browser chrome follows the page', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.click('#theme-toggle');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#131111');
  });

  test('it leaves the tab order when the mobile menu is open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');
    await page.click('.burger');
    await expect(page.locator('.theme-toggle')).toHaveAttribute('inert', '');
  });

  for (const path of PAGES) {
    test(`no contrast failures in dark on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.click('#theme-toggle');
      // Panels and cards fade in. Measuring mid-animation reports failures
      // that do not exist once the page has settled.
      await page.waitForTimeout(900);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.length} nodes — ${v.nodes[0]?.html?.slice(0, 90)}`)
      ).toEqual([]);
    });
  }
});
