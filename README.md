# Hacker News Live Feed

## Overview
Hacker News Live Feed is a web application that scrapes the latest articles from Hacker News, stores them in a database, and serves real-time updates through WebSocket and REST APIs. The application includes a live front-end dashboard to display the latest articles with updates every 5 minutes.

## Features
- **Scraper**: Automatically scrapes the newest articles from Hacker News using Puppeteer.
- **Database**: Stores scraped data using Prisma and a connected MySQL database.
- **WebSocket Server**: Sends real-time updates to clients every 5 minutes.
- **REST API**: Provides server status.
- **Front-End Dashboard**: A Responsive dashboard displaying articles with real-time updates and initial article count.

## Tech Stack
- **Back-End**: Node.js, Puppeteer, Prisma, Express, WebSocket
- **Front-End**: React, Material-UI
- **Database**: MySQL (along with Prisma)
- **Tools**: Puppeteer for web scraping, Prisma ORM for database management

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)
- SQL Database (MySQL, available for free from [Aiven.io](https://aiven.io/))
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/prynsh/HackerNews_Scraping.git
    cd HackerNews_Scraping
    ```

2. **Install dependencies**:

    Navigate to the server and web directories and install dependencies:
    ```bash
    cd apps/server && npm install
    cd apps/web && npm install
    cd ..
    npm install
    ```

3. **Setup the database**:
    - Ensure your database is running.
    - Create a top level `.env` file and configure the database connection in the `.env` file:
      ```env
      DATABASE_URL="your-database-connection-string"
      ```
    - Apply the Prisma schema:
      ```bash
      npx prisma migrate dev --name init
      ```

4. **Start the server**:

    Run the following command to start both the backend and frontend:
    ```bash
    npm run dev
    ```

    After starting the application, visit `http://localhost:3000` to view the front-end dashboard.

---

## API Usage

### REST API

#### `GET /status`
Returns the server status:
```json
{
  "status": "ok",
  "message": "WebSocket server is running on ws://localhost:3001"
}
```
### WebSocket API

**Connection URL**: ws://localhost:3001

**Message Types**:
- **initialData**: Contains articles from the last 5 minutes and their count.
- **articleUpdate**: Sends the latest articles every 5 minutes.