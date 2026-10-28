# Playwright + TypeScript UI and API Automation

[![Playwright Tests](https://github.com/swethark105/Playwright_POC/actions/workflows/playwright.yml/badge.svg)](https://github.com/swethark105/Playwright_POC/actions/workflows/playwright.yml)

A QA portfolio project demonstrating browser and API testing, reusable page objects, accessibility scans, failure diagnostics, scheduled daily runs through GitHub Actions, and AI-assisted test authoring with the Playwright MCP server.

## Test coverage

### UI tests: SauceDemo

| Spec | Scenario | Tags |
| --- | --- | --- |
| `login.spec.ts` | Invalid password prevents login | `@smoke` |
| `login.spec.ts` | Locked-out user cannot log in | |
| `cart.spec.ts` | Log in, add a backpack, verify cart contents | `@smoke` |
| `checkout.spec.ts` | Check out two items and verify the item total | |
| `checkout.spec.ts` | Checkout requires a first name | |
| `accessibility.spec.ts` | Axe scans of login, inventory, and cart pages | `@a11y` |

Each UI scenario runs in Chromium and Firefox.

### API tests: DummyJSON

| Spec | Scenario | Tags |
| --- | --- | --- |
| `api/products.spec.ts` | Retrieve a product and validate status, content type, and fields | `@smoke` |
| `api/products.spec.ts` | Verify product pagination using limit and skip | |

API tests run once in a separate Playwright project. DummyJSON is a separate demo service; these tests do not validate SauceDemo's backend.

The suite contains 16 executions: 14 browser executions (7 scenarios × 2 browsers) and 2 API tests.

## Framework design

- Page objects (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`) centralize locators and reusable actions.
- Test data (demo users, checkout customer) and base URLs live in `test-data/`, with environment variable overrides.
- `baseURL` is set per project, so page objects navigate with relative paths.
- Tags (`@smoke`, `@a11y`) let you run a fast subset or the accessibility scans on their own.
- Screenshots are stored per test and attached to the HTML report; journeys are grouped with `test.step`.
- Axe scans (WCAG 2 A/AA rules) attach full results and add a violation count to each test's annotations.
- Failed browser tests retain traces, screenshots, and videos.
- CI retries each failing test once and marks tests that pass on retry as flaky.
- Reports: HTML, JUnit XML (`test-results/junit.xml`, used by Jenkins), and inline GitHub annotations in CI.
- TypeScript strict checking runs in CI before the tests.

Accessibility scans currently record findings without failing tests on violations. Automated scans do not establish full accessibility compliance.

## Technology

- Playwright Test
- TypeScript
- Axe for Playwright
- Playwright MCP server
- Node.js and npm
- GitHub Actions, Jenkins, and Docker

## Run locally

Use Node.js 24 to match GitHub Actions.

```bash
npm ci
npx playwright install chromium firefox
npm test
```

Useful subsets:

```bash
npm run test:smoke      # fastest checks across browsers and API
npm run test:a11y       # accessibility scans only
npm run test:chromium
npm run test:firefox
npm run test:api
npm run test:headed     # watch the browsers
npm run typecheck
npm test -- --list      # list discovered tests
npm run report          # open the HTML report
```

Point the suite at another environment with `UI_BASE_URL`, `API_BASE_URL`, or `SAUCE_PASSWORD`.

## Run in Docker

```bash
docker compose up --build
```

The HTML report and test results are written to `playwright-report/` and `test-results/` on your machine. Keep the image tag in `dockerfile` in step with the Playwright version in `package-lock.json`.

## Continuous integration

GitHub Actions runs the full suite:

- on pushes and pull requests targeting main or master
- **every day at 11:07 UTC** (7:07 AM Eastern in daylight time, 6:07 AM in winter)
- on demand from the Actions tab with **Run workflow**

Each run type-checks the code, runs UI and API tests, and uploads the HTML report and test results as an artifact kept for 30 days. GitHub notifies the person who last edited the schedule when a scheduled run fails. GitHub pauses scheduled workflows after 60 days with no repository activity; re-enable it from the Actions tab if that happens.

### Jenkins

The `jenkinsfile` runs the suite with Node.js directly, so it works on Windows and Linux agents without Docker. It runs **every day between 7:00 and 7:59 AM Eastern**, follows daylight saving time, and publishes the HTML report, JUnit results, and archived test output for each build.

Setup in Jenkins:

1. Install the **Pipeline**, **NodeJS**, **HTML Publisher**, **JUnit**, and **Timestamper** plugins.
2. Under **Manage Jenkins → Tools → NodeJS installations**, add one named `NodeJS_Playwright` (Node.js 24).
3. Create a **Pipeline** job, choose **Pipeline script from SCM**, set the repository to `https://github.com/swethark105/Playwright_POC.git`, branch `*/main`, and script path `jenkinsfile`.
4. Click **Build Now** once. Jenkins registers the daily schedule after the first build.

To run the suite in Docker instead, use `docker compose up --build`.

## AI-assisted test authoring (Playwright MCP)

The repo includes configuration for the [Playwright MCP server](https://github.com/microsoft/playwright-mcp), which lets an AI assistant drive a real browser to explore the app and draft or debug tests.

- **Claude Code** reads `.mcp.json` at the repo root and offers to enable the `playwright` server when you open the project.
- **VS Code (GitHub Copilot agent mode)** reads `.vscode/mcp.json`.

Both pin `@playwright/mcp` to a specific version so behavior doesn't change unexpectedly; bump it deliberately. Example prompts:

- "Use the Playwright MCP to explore the SauceDemo product sort dropdown and draft a test using our page objects."
- "Run the failing checkout test, inspect the page, and explain why the locator no longer matches."

Generated tests are drafts: review locators, assertions, and test data before committing them.

## Project files

- `pages/`: page objects for login, inventory, cart, and checkout
- `test-data/`: demo users, checkout customer, and base URLs
- `support/attachments.ts`: screenshot attachment helper
- `tests/`: UI specs; `tests/api/`: API specs
- `playwright.config.ts`: projects, retries, workers, and reporters
- `tsconfig.json`: TypeScript configuration
- `.github/workflows/playwright.yml`: CI and daily schedule
- `jenkinsfile`: Jenkins pipeline with a daily schedule
- `dockerfile`, `docker-compose.yml`: Docker execution
- `.mcp.json`, `.vscode/mcp.json`: Playwright MCP server configuration

## Future improvements

- Explicit accessibility acceptance criteria that fail on new violations
- Product sorting and multi-user scenarios (problem_user, performance_glitch_user)
- Shared login state via a setup project to speed up UI tests
