FROM node:20

# Install necessary libraries for Puppeteer/Chromium to run
RUN apt-get update && apt-get install -y \
    wget gnupg \
    libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libxss1 libxtst6 \
    libnss3 libatk-bridge2.0-0 libgtk-3-0 libasound2 libgbm1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies (this will download Puppeteer's Chrome automatically)
COPY package*.json ./
RUN npm install

# Copy application files and build
COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
