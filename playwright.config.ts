import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests against the built site.
 *
 * These exist because two regressions shipped during development without
 * anyone noticing: the newsletter band vanished from /map/, and every style
 * on the "Do not hire me if…" list was deleted. Both were found by reading
 * compiled HTML by hand. That is what this replaces.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4321', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // iPhone 13 means WebKit, which is the engine real iPhones use. Worth the
    // extra browser: it is where CSS support differs most.
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npx http-server dist -p 4321 --silent',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
