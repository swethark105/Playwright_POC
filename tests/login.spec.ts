import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';
import { UI_BASE_URL } from '../test-data/urls';

test.describe('login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('invalid password prevents login', { tag: '@smoke' }, async ({ page }) => {
    await loginPage.loginAs({ ...users.standard, password: 'incorrect_password' });

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(`${UI_BASE_URL}/`);
  });

  test('locked-out user cannot log in', async ({ page }) => {
    await loginPage.loginAs(users.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(`${UI_BASE_URL}/`);
  });
});
