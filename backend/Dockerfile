FROM ghcr.io/puppeteer/puppeteer:latest

USER root

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Give pptruser full ownership of the app directory so it can
# write .wwebjs_auth session files without permission errors
RUN chown -R pptruser:pptruser /app

# Switch to non-root user (required for Chrome to run)
USER pptruser

EXPOSE 5000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["npm", "start"]
