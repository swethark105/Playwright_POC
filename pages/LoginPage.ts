import { Page, Locator } from '@playwright/test';
import type { User } from '../test-data/users';

export class LoginPage {
  readonly heading: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Swag Labs', { exact: true });
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.page.goto('/');
  }

  async enterUsername(username: string) {
    await this.username.fill(username);
  }

  async enterPassword(password: string) {
    await this.password.fill(password);
  }

  async submit() {
    await this.loginButton.click();
  }

  async loginAs(user: User) {
    await this.enterUsername(user.username);
    await this.enterPassword(user.password);
    await this.submit();
  }
}
