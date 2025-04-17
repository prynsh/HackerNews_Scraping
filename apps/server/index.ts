import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { scrapeHackerNews } from './services/scraper';
import { subMinutes } from 'date-fns';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

let httpServer = createServer(app);
const wss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


const getInitialData = async (ws:WebSocket) => {
  try {
    await scrapeHackerNews();

    const fiveMinutesAgo = subMinutes(new Date(), 5);
    const recentArticles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: fiveMinutesAgo,
        },
      },
      orderBy: {
        publishedAt: 'desc'
      },
    });

    console.log(`Initial count of articles from last 5 minutes: ${recentArticles.length}`);

    ws.send(JSON.stringify({
      type: 'initialData',
      recentArticles: recentArticles,
      recentArticlesCount: recentArticles.length,
    }));
  } catch (error) {
    console.error('Error getting initial data:', error);
  }
};


const sendArticleUpdates = async (ws:WebSocket) => {
  try {
    const articles = await scrapeHackerNews();

    if (!articles || articles.length === 0) {
      console.log('No new articles to send.');
      return;
    }

    const fiveMinutesAgo = subMinutes(new Date(), 5);
    const recentArticles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: fiveMinutesAgo,
        },
      },
      orderBy: {
        publishedAt: 'desc'
      },
    });

    ws.send(JSON.stringify({
      type: 'articleUpdate',
      articles: recentArticles,
    }));

  } catch (error) {
    console.error('Error sending article updates:', error);
  }
};
wss.on('connection', async (ws) => {
  console.log('Client connected');

  await getInitialData(ws);

  const interval = setInterval(() => sendArticleUpdates(ws), 300000);
  sendArticleUpdates(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});


app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'WebSocket server is running on ws://localhost:3001'
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});