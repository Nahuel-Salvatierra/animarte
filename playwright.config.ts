import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  testMatch: '**/*.spec.ts',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 1,
  reporter: 'html',
  workers: 2,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    trace: 'on',
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: true,
    },
  ],
  webServer: {
    command: 'npm run test',
    url: 'http://127.0.0.1:3001',
    timeout: 60000,
    reuseExistingServer: true,
  },
});
