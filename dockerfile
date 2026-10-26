# Official Playwright image with Node.js and browsers pre-installed.
# Keep this tag in step with the @playwright/test version in package-lock.json,
# otherwise the bundled browsers won't match what Playwright expects.
FROM mcr.microsoft.com/playwright:v1.53.2-noble

WORKDIR /app

# Copy package files first so the dependency layer is cached between builds.
COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
