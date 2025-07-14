import { test, expect } from '@playwright/test';
import fs from 'fs';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // e.g., 2025-07-08T23-51-00-000Z

test('test with step-by-step screenshots', async ({ page }) => {
  const screenshot = async (step: string) => {
        const dir = 'C:/Users/ramak/OneDrive/Documents/Playwright/screenshots';
    if (!fs.existsSync('dir')) fs.mkdirSync(dir, {recursive: true});
    await page.screenshot({ path: `${dir}/${step}-${timestamp}.png`, fullPage: true });
  };

  await page.goto('https://www.saucedemo.com/');
   await screenshot('01-login-page');
  await expect(page.getByText("Swag Labs")).toBeVisible();

  await page.locator('[data-test="username"]').fill('standard_user');
  //await expect(page.getByText('')).toBeVisible();

  await screenshot('02-enter username');
  await page.locator('[data-test="username"]').press('Tab');

  await page.locator('[data-test="password"]').fill('secret_sauce');
   await screenshot('03-password-filled');

  await page.locator('[data-test="login-button"]').click();
   await page.waitForLoadState();
  await screenshot('04-logged-in');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.waitForLoadState()

    await screenshot('05-added-to-cart');
  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.waitForLoadState();
  await screenshot('06-cart-page');


});


