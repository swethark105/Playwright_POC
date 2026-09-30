import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/');
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
}