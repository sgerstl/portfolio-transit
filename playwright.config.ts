import { defineConfig, devices } from '@playwright/test';

// Interaction checks in Chrome and Firefox, at desktop and phone width, against the built site.
// Run: npm run test:e2e   (Firefox once: npx playwright install firefox)
const PORT = 4330;
const desktop = { viewport: { width: 1440, height: 900 } };
const phone = { viewport: { width: 375, height: 812 } };

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run build && npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', ...desktop } },
    { name: 'chrome-phone', use: { ...devices['Desktop Chrome'], channel: 'chrome', ...phone, hasTouch: true } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'], ...desktop } },
    { name: 'firefox-phone', use: { ...devices['Desktop Firefox'], ...phone } },
  ],
});
