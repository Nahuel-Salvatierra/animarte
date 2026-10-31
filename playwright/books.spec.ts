import { expect } from '@playwright/test';

import { test } from '../test-setup';

test.describe('Books', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/cuadernos/anime', {
      waitUntil: 'domcontentloaded',
    });
  });

  test('should display books', async ({ page }) => {
    await expect(page.getByTestId('catalog-card').first()).toBeVisible({
      timeout: 15000,
    });
    const catalog = await page.getByTestId('catalog-card').all();
    expect(catalog.length).toBe(3);
  });
});
