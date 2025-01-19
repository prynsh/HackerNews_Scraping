import express from 'express';
import { WebSocketServer } from 'ws';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { scrapeHackerNews } from './services/scraper';

const app = express();
const prisma = new PrismaClient();

let httpServer = createServer(app);
const wss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', async (ws) => {
  console.log('Client connected');

  const sendUpdates = async () => {
    try {
      const articles = await scrapeHackerNews();

      if (!articles || articles.length === 0) {
        console.log('No new articles to send.');
        return;
      }
      const storedArticles = await prisma.article.findMany();
      if (storedArticles && storedArticles.length > 0) {
        ws.send(JSON.stringify(storedArticles)); 
      } else {
        console.log('No articles found in the database.');
      }

    } catch (error) {
      console.error('Error sending updates:', error);
    }
  };

  const interval = setInterval(sendUpdates, 50000);
  sendUpdates();

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

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});