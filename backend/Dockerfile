FROM ghcr.io/puppeteer/puppeteer:latest

USER root

WORKDIR /app

# CRITICAL: Set these BEFORE npm install so puppeteer skips downloading a
# redundant Chrome and instead uses the one already in this Docker image.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

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
