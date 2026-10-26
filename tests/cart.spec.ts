import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../test-data/users';
import { attachScreenshot } from '../support/attachments';

test('user can log in and add a backpack to cart', { tag: '@smoke' }, async ({
  page,
}, testInfo) => {
  const loginPage = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await test.step('open login page', async () => {
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
    await attachScreenshot(page, testInfo, '01-login-page');
  });

  await test.step('log in as standard user', async () => {
    await loginPage.loginAs(users.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await attachScreenshot(page, testInfo, '02-logged-in');
  });

  await test.step('add backpack to cart', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await attachScreenshot(page, testInfo, '03-added-to-cart');
  });

  await test.step('verify cart contents', async () => {
    await inventory.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cart.title).toBeVisible();
    await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
    await attachScreenshot(page, testInfo, '04-cart-page');
  });
});
