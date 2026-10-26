import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, checkoutCustomer } from '../test-data/users';
import { attachScreenshot } from '../support/attachments';

test('user can check out two items', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginPage.open();
  await loginPage.loginAs(users.standard);

  await inventory.addToCart('sauce-labs-backpack');
  await inventory.addToCart('sauce-labs-bike-light');
  await expect(inventory.cartBadge).toHaveText('2');

  await inventory.openCart();
  await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  await cart.checkout();

  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await checkout.enterCustomer(checkoutCustomer);

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkout.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  // Backpack $29.99 + Bike Light $9.99
  await expect(checkout.subtotal).toHaveText('Item total: $39.98');
  await attachScreenshot(page, testInfo, 'checkout-overview');

  await checkout.finish();
  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  await attachScreenshot(page, testInfo, 'checkout-complete');
});

test('checkout requires a first name', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginPage.open();
  await loginPage.loginAs(users.standard);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.openCart();
  await cart.checkout();

  await checkout.enterCustomer({ ...checkoutCustomer, firstName: '' });

  await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
});
