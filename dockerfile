# Use official Playwright image with Node.js and browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.43.1

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for dependency caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy the rest of the project files (including tests folder)
COPY . .

# Install Playwright browsers (usually already installed, but safe to confirm)
RUN npx playwright install

# Default command: Run Playwright tests
CMD ["npx", "playwright", "test"]

