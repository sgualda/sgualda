import { test, expect, type Page } from '@playwright/test';

/**
 * The responsive matrix (#Q-053).
 *
 * The breakpoints were chosen by eye at a desk, on one machine, in portrait.
 * This is the evidence that they hold everywhere else — landscape phones, both
 * iPad orientations, a folded Galaxy Fold and the desktop widths people
 * actually use.
 *
 * Deliberately not screenshot-based. Reference images go stale on every copy
 * edit and differ by machine, so they get regenerated without being read,
 * which makes them worse than nothing. These assert the invariants instead:
 * nothing scrolls sideways, nothing overflows its container, the nav is in the
 * right mode, and tap targets stay thumb-sized.
 */

const VIEWPORTS = [
  // The narrowest thing anybody still uses. Folded Galaxy Fold is 280px, and
  // if the site survives that it survives everything.
  { name: 'Galaxy Fold, folded', w: 280, h: 653 },
  { name: 'iPhone SE', w: 375, h: 667 },
  { name: 'iPhone 15', w: 393, h: 852 },
  { name: 'iPhone 15 Pro Max', w: 430, h: 932 },
  { name: 'iPhone 15, landscape', w: 852, h: 393 },
  { name: 'iPad mini, portrait', w: 744, h: 1133 },
  { name: 'iPad Pro 11, portrait', w: 834, h: 1194 },
  { name: 'iPad Pro 11, landscape', w: 1194, h: 834 },
  { name: 'laptop', w: 1280, h: 800 },
  { name: 'desktop', w: 1920, h: 1080 },
  { name: 'large desktop', w: 2560, h: 1440 },
];

/** One page per kind of layout, rather than all 41. */
const PAGES = [
  '/',
  '/work-with-me/',
  '/tools/why-is-nobody-using-your-product/',
  '/map/',
  '/case-studies/glintale/',
  '/writing/heart-framework-vs-nps-user-experience/',
  '/glossary/',
];

/** Elements wider than the viewport, which is what causes sideways scroll. */
async function overflowing(page: Page) {
  return page.evaluate(() => {
    const limit = document.documentElement.clientWidth;
    const bad: string[] = [];
    for (const el of document.body.querySelectorAll<HTMLElement>('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || getComputedStyle(el).position === 'fixed') continue;
      // Parked off-canvas on purpose — the skip link lives at left:-9999px
      // until it takes focus. Anything entirely left of the viewport is that.
      if (r.right <= 0) continue;
      // Inside a deliberate scroll container. A wide comparison table is meant
      // to extend past its box; that is what the box is for. What matters is
      // that the container itself fits, and it is checked on its own turn.
      let scrollable = false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement)
        if (/auto|scroll/.test(getComputedStyle(p).overflowX)) { scrollable = true; break; }
      if (scrollable) continue;
      // 1px of tolerance: sub-pixel layout rounds up on fractional widths.
      if (r.right > limit + 1 || r.left < -1) {
        const parent = el.parentElement;
        // Report the outermost offender only — a wide container makes every
        // child look guilty and the list becomes unreadable.
        if (parent && parent.getBoundingClientRect().right > limit + 1) continue;
        bad.push(`${el.tagName.toLowerCase()}.${el.className || '—'} (${Math.round(r.width)}px)`);
      }
    }
    return bad.slice(0, 5);
  });
}

test.describe('responsive matrix', () => {
  // Runs in one browser only. This is layout maths, not engine behaviour, and
  // 11 viewports × 7 pages × 2 engines is four minutes of CI for no new signal.
  test.skip(({ browserName }) => browserName !== 'chromium', 'layout, not engine');

  for (const v of VIEWPORTS) {
    test(`${v.name} (${v.w}×${v.h}) — nothing overflows`, async ({ page }) => {
      await page.setViewportSize({ width: v.w, height: v.h });
      for (const path of PAGES) {
        await page.goto(path);
        expect(await overflowing(page), `${path} at ${v.name}`).toEqual([]);
        const scrolls = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        );
        expect(scrolls, `${path} scrolls sideways at ${v.name}`).toBe(false);
      }
    });
  }

  test('the burger appears exactly at the documented breakpoint', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('.burger');
    const links = page.locator('.site-header .links');

    await page.setViewportSize({ width: 821, height: 800 });
    await expect(links).toBeVisible();
    await expect(burger).toBeHidden();

    await page.setViewportSize({ width: 820, height: 800 });
    await expect(burger).toBeVisible();
    await expect(links).toBeHidden();
  });

  test('tap targets stay thumb-sized on the narrowest phone', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 653 });
    await page.goto('/tools/why-is-nobody-using-your-product/');
    // The check's own options are the thing you actually tap here.
    for (const el of await page.locator('button, a.btn').all()) {
      if (!(await el.isVisible())) continue;
      const box = await el.boundingBox();
      expect(box!.height, `${await el.innerText()} is under 44px tall`).toBeGreaterThanOrEqual(44);
    }
  });

  test('prose never runs past a readable measure on a large screen', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('/writing/heart-framework-vs-nps-user-experience/');
    const widths = await page.locator('article p').evaluateAll((ps) =>
      ps.map((p) => {
        const size = parseFloat(getComputedStyle(p).fontSize);
        // ~0.5em per character is the usual approximation for a serif or
        // grotesque at text sizes; good enough to catch a runaway column.
        return Math.round(p.getBoundingClientRect().width / (size * 0.5));
      })
    );
    expect(Math.max(...widths)).toBeLessThanOrEqual(80);
  });
});
