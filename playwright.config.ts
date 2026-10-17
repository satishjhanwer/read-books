import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  // Several axe scans per test; the book page is long enough that they need more than the 30 s default.
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Trailing slash matters: relative page.goto('book/…') paths resolve under /read-books/.
    baseURL: `http://localhost:${String(PORT)}/read-books/`,
    trace: 'retain-on-failure',
    // The production build registers a service worker; only e2e/pwa.spec.ts opts back in.
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the production build, served the way GitHub Pages serves it (see scripts/serve-pages.mjs).
  webServer: {
    command: `yarn build && yarn serve:pages`,
    env: { PORT: String(PORT) },
    url: `http://localhost:${String(PORT)}/read-books/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
