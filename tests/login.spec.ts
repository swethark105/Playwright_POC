import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('invalid password prevents login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.enterUsername('standard_user');
  await loginPage.enterPassword('incorrect_password');
  await loginPage.submit();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );

  await expect(loginPage.loginButton).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('locked-out user cannot log in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.enterUsername('locked_out_user');
  await loginPage.enterPassword('secret_sauce');
  await loginPage.submit();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.'
  );

  await expect(loginPage.loginButton).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});