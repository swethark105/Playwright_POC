# Playwright UI Automation POC

A TypeScript and Playwright portfolio project that tests core shopping flows on [SauceDemo](https://www.saucedemo.com/). It demonstrates browser automation, assertions, screenshot capture, and CI configuration.

## What this project covers

- Login and shopping cart UI workflows
- Playwright tests written in TypeScript
- Screenshots captured during test execution
- Jenkins pipeline configuration
- An Axe Playwright dependency for accessibility testing

## Run locally

Requirements: Node.js and npm.

```bash
npm ci
npx playwright install
npx playwright test
```

To open the Playwright HTML report:

```bash
npx playwright show-report
```

## Project files

- `tests/` — Playwright test scenarios
- `playwright.config.ts` — test runner configuration
- `screenshots/` — captured screenshots
- `jenkinsfile` — Jenkins pipeline configuration
- `.github/workflows/` — GitHub Actions configuration

## Next improvements

This is an evolving portfolio project. Planned additions include reusable page objects, API tests, stronger failure diagnostics, and a fast CI smoke suite.