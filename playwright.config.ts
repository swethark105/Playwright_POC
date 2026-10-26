import { defineConfig, devices } from '@playwright/test';
import { UI_BASE_URL, API_BASE_URL } from './test-data/urls';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  // The suite runs against public demo sites, so retry once in CI to absorb network blips.
  // Tests that pass only on retry are marked "flaky" in the report.
  retries: isCI ? 1 : 0,
  // Two workers on CI runners; locally Playwright picks a default based on CPU cores.
  workers: isCI ? 2 : undefined,

  reporter: [
    [isCI ? 'github' : 'list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'firefox',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Firefox'], baseURL: UI_BASE_URL },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: API_BASE_URL },
    },
  ],
});
