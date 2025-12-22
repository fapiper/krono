import { expect, test } from '@playwright/test';

test('should show both bid and ask data', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(12000);

  const orderbookTables = page.locator('.krono-orderbook-table');
  await expect(orderbookTables.first()).toBeVisible({ timeout: 15000 });

  const tableCount = await orderbookTables.count();
  expect(tableCount).toBeGreaterThanOrEqual(2);
});
