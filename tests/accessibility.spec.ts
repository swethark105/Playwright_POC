import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../test-data/users';

// These scans record findings without failing on violations (SauceDemo has known issues).
// Each scan attaches the full axe report and adds a violation count to the test annotations.
// To enforce a standard, replace the annotation with: expect(results.violations).toEqual([])
async function scan(page: Page, testInfo: TestInfo, name: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  await testInfo.attach(`${name}-accessibility`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });
  testInfo.annotations.push({
    type: 'a11y',
    description: `${name}: ${results.violations.length} violation type(s)`,
  });
}

test.describe('accessibility scans', { tag: '@a11y' }, () => {
  test('login page', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
    await scan(page, testInfo, 'login');
  });

  test('inventory and cart pages', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.open();
    await loginPage.loginAs(users.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await scan(page, testInfo, 'inventory');

    await inventory.addToCart('sauce-labs-backpack');
    await inventory.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await scan(page, testInfo, 'cart');
  });
});
