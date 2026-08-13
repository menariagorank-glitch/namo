FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to configure the app directory and install dependencies
USER root

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Switch back to the non-root user provided by the puppeteer image
# This is crucial because Chrome refuses to run as root securely.
USER pptruser

EXPOSE 5000

# Tell Puppeteer to skip downloading another Chrome since this image already has it perfectly configured
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["npm", "start"]
