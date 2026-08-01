import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const src = readFileSync('src/lib/site.ts', 'utf8');
const section = (n: string) => {
  const m = src.match(new RegExp(`${n}:\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};
const URLS = [...section('pages'), ...section('tools'), ...section('topics'), ...section('writing')];

for (const url of URLS) {
  test(`${url} has no accessibility violations`, async ({ page }) => {
    await page.goto(url);

    // Panels fade in, so axe measuring immediately reads colours at partial
    // opacity and reports contrast failures that do not exist once settled.
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity)
    );

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    if (violations.length) {
      console.log(
        `\n${url}\n` +
          violations
            .map((v) => `  [${v.impact}] ${v.id}: ${v.help}\n    ${v.nodes.slice(0, 2).map((n) => n.html.slice(0, 110)).join('\n    ')}`)
            .join('\n')
      );
    }
    expect(violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
  });
}

test('a check announces each question and moves focus to it', async ({ page }) => {
  await page.goto('/tools/why-is-nobody-using-your-product/');

  // The panel is a live region, or a screen reader hears nothing change.
  const box = page.locator('#box');
  await expect(box).toHaveAttribute('aria-live', 'polite');
  await expect(box).toHaveAttribute('aria-atomic', 'true');

  // Answering moves focus onto the new question rather than losing it.
  await page.locator('.opt').first().click();
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('q-head');

  // And onto the verdict at the end.
  await page.locator('.opt').first().click();
  await page.locator('.opt').first().click();
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('q-head');
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('H2');
});

test('the qualifier does the same', async ({ page }) => {
  await page.goto('/work-with-me/');
  await expect(page.locator('#qfBox')).toHaveAttribute('aria-live', 'polite');
  await page.locator('.opt').first().click();
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('qf-head');
});

// WebKit only honours Tab when macOS Full Keyboard Access is on, so this one
// runs where it can actually be observed.
test('the whole site is reachable with a keyboard', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Tab navigation is off by default in WebKit');
  await page.goto('/');
  // The skip link must be the first stop and must actually go somewhere.
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    href: (document.activeElement as HTMLAnchorElement)?.getAttribute('href'),
  }));
  expect(first.text).toContain('Skip');
  expect(await page.locator(first.href!).count()).toBe(1);
});
