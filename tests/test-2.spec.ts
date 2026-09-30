import { LoginPage } from '../pages/LoginPage';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('user can log in and add a backpack to cart', async ({
  page,
}, testInfo) => {
  const loginPage = new LoginPage(page);

  // Save screenshots separately for each test and browser.
  const screenshot = async (step: string) => {
    const image = await page.screenshot({
      path: testInfo.outputPath(`${step}.png`),
      fullPage: true,
    });

    await testInfo.attach(step, {
      body: image,
      contentType: 'image/png',
    });
  };

  // Record accessibility findings in the HTML report.
  const scanAccessibility = async (step: string) => {
    const results = await new AxeBuilder({ page }).analyze();

    await testInfo.attach(`${step}-accessibility`, {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });
  };

  // Step 1: Open login page.
  await loginPage.open();
  await expect(page.getByText('Swag Labs', { exact: true })).toBeVisible();
  await screenshot('01-login-page');
  await scanAccessibility('login');

  // Step 2: Enter username.
  await loginPage.enterUsername('standard_user');
  await screenshot('02-username-filled');

  // Step 3: Enter password.
  await loginPage.enterPassword('secret_sauce');
  await screenshot('03-password-filled');

  // Step 4: Log in and verify the inventory page.
  await loginPage.submit();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await screenshot('04-logged-in');
  await scanAccessibility('inventory');

  // Step 5: Add backpack and verify the cart count.
  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  await expect(
    page.locator('[data-test="shopping-cart-badge"]')
  ).toHaveText('1');

  await screenshot('05-added-to-cart');

  // Step 6: Open cart and verify the backpack.
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(
    page.locator('[data-test="inventory-item-name"]')
  ).toHaveText('Sauce Labs Backpack');

  await screenshot('06-cart-page');
  await scanAccessibility('cart');
});