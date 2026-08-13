FROM ghcr.io/puppeteer/puppeteer:latest

USER root

WORKDIR /app

# CRITICAL: Set these BEFORE npm install so puppeteer skips downloading a
# redundant Chrome. We rely on the base image's built-in PUPPETEER_EXECUTABLE_PATH.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Give pptruser write access so WhatsApp can save its session files
RUN chown -R pptruser:pptruser /app

# Chrome must run as non-root
USER pptruser

EXPOSE 5000

CMD ["npm", "start"]
