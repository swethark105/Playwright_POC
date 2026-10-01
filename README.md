# Playwright + TypeScript UI and API Automation

A QA portfolio project demonstrating browser and API testing, reusable page objects, accessibility scans, failure diagnostics, and automated execution through GitHub Actions.

## Test coverage

### UI tests: SauceDemo

- Successful login, adding a backpack, and verifying cart contents
- Invalid password prevents login
- Locked-out user cannot log in

Each scenario runs in Chromium and Firefox.

### API tests: DummyJSON

- Retrieve a product and validate status, content type, and response fields
- Verify product pagination using limit and skip

API tests run once in a separate Playwright project. DummyJSON is a separate demo service; these tests do not validate SauceDemo's backend.

The current suite contains five scenarios and eight executions:
six browser executions and two API tests.

## Framework design

- Login Page Object centralizes locators and reusable actions.
- Playwright fixtures provide isolated browser pages and API request contexts.
- Assertions verify URLs, error messages, cart counts, and response data.
- Screenshots are stored per test and attached to the HTML report.
- Axe scans record accessibility findings for login, inventory, and cart pages.
- Failed browser tests retain traces, screenshots, and videos.
- TypeScript configuration enables strict checking and Node.js types.
- One worker limits resource contention during execution.

Accessibility scans currently record findings without failing tests on violations. Automated scans do not establish full accessibility compliance.

## Technology

- Playwright Test
- TypeScript
- Axe for Playwright
- Node.js and npm
- GitHub Actions
- Existing Jenkins and Docker configuration files

## Run locally

Use Node.js 24 to match GitHub Actions.

```bash
npm ci
npx playwright install chromium firefox
npm test
```

Run an individual project:

```bash
npm run test:chromium
npm run test:firefox
npm test -- --project=api
```

Run browsers visibly:

```bash
npm run test:headed
```

List discovered tests:

```bash
npm test -- --list
```

Open the HTML report:

```bash
npm run report
```

## Project files

- `pages/LoginPage.ts`: reusable login locators and actions
- `tests/login.spec.ts`: negative login scenarios
- `tests/test-2.spec.ts`: login and cart journey with report attachments
- `tests/api/products.spec.ts`: product API validation
- `playwright.config.ts`: projects, execution settings, and reporting
- `tsconfig.json`: TypeScript configuration
- `.github/workflows/playwright.yml`: CI workflow
- `jenkinsfile`: existing Jenkins configuration
- `dockerfile` and `docker-compose.yml`: existing Docker configuration

## Continuous integration

GitHub Actions runs on pushes and pull requests targeting main or master.

The workflow installs dependencies and browsers, runs UI and API tests,
and uploads the HTML report with a 30-day retention period.

## Future improvements

- Additional page objects and checkout scenarios
- Separate fast smoke tests from accessibility scans
- Explicit accessibility acceptance criteria
- AI-assisted test planning and generation with human review