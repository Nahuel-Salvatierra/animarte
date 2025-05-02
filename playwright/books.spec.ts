import { expect } from '@playwright/test';

import { test } from '../test-setup';

test.describe('Books', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();

    await page.context().clearCookies();
    await page.goto('/cuadernos/anime', {
      waitUntil: 'networkidle',
    });
  });

  test('should display books', async ({ page }) => {
    const catalog = await page.getByTestId('catalog-card').all();

    expect(catalog.length).toBe(3);
  });
});
