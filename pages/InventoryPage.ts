import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /** Product slug as used in SauceDemo's data-test ids, e.g. "sauce-labs-backpack". */
  async addToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
