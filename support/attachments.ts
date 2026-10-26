import type { Page, TestInfo } from '@playwright/test';

/** Saves a full-page screenshot per test and browser, and attaches it to the HTML report. */
export async function attachScreenshot(page: Page, testInfo: TestInfo, step: string) {
  const image = await page.screenshot({
    path: testInfo.outputPath(`${step}.png`),
    fullPage: true,
  });

  await testInfo.attach(step, { body: image, contentType: 'image/png' });
}
