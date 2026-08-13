# Use official Puppeteer image which has all OS-level deps for Chrome pre-configured
FROM ghcr.io/puppeteer/puppeteer:latest

USER root

WORKDIR /app

# Copy package files and install dependencies
# NOTE: Do NOT set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD here.
# We let puppeteer download its own bundled Chrome during npm install
# so puppeteer.executablePath() can find it correctly at runtime.
COPY package*.json ./
RUN npm install

# Copy source code and build TypeScript
COPY . .
RUN npm run build

# Give pptruser ownership so it can write .wwebjs_auth session files
RUN chown -R pptruser:pptruser /app

# Tell Puppeteer to skip downloading another Chrome since this image already has it
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Switch to non-root user (Chrome requires this)
USER pptruser

EXPOSE 5000

CMD ["npm", "start"]
