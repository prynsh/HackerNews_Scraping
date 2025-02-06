# Use Node.js base image
FROM node:22.13.1

# Install necessary dependencies for Puppeteer (headless Chromium)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fontconfig \
    locales \
    libx11-xcb1 \
    libnss3 \
    libgdk-pixbuf2.0-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxtst6 \
    libgdk-pixbuf2.0-0 \
    libasound2 \
    libxss1 \
    libappindicator3-1 \
    libnspr4 \
    libnss3 \
    lsb-release \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libdbus-1-3 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory for Prisma
WORKDIR /apps

# Copy the Prisma folder from the root into the container (includes the schema)
COPY prisma ./prisma

COPY .env ./
# Now copy the root-level package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Move to the backend directory
WORKDIR /apps/server

# Copy the backend package.json and package-lock.json as well (if separate)
COPY apps/server/package.json ./

# Install dependencies for the entire project
RUN npm install

# Copy the entire backend code (including server files)
COPY apps/server ./ 

# Generate Prisma Client
RUN npx prisma generate --schema=/apps/prisma/schema.prisma

# Expose port for the backend
EXPOSE 3001

# Start the backend in dev mode
CMD ["npm", "run", "dev"]
