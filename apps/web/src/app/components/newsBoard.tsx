'use client';

import { LinearProgress } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';

interface Article {
  title: string;
  link: string;
  score: string;
}

interface WebSocketMessage {
  type: 'initialData' | 'articleUpdate';
  articles?: Article[];
  recentArticles?: Article[];
  recentArticlesCount?: number;
}

export default function HackerNewsBoard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<string>('Loading your Articles...');
  const [error, setError] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(10);
  const [buffer, setBuffer] = useState<number>(30);
  const [initialArticleCount, setInitialArticleCount] = useState<number>(0);
  const [initialDataReceived, setInitialDataReceived] = useState<boolean>(false);

  const connect = useCallback(async () => {
    try {
      const response = await fetch('/');
      if (!response.ok) {
        throw new Error('Failed to start WebSocket server');
      }

      const socket = new WebSocket('ws://localhost:3001');
      setWs(socket);

      socket.onopen = () => {
        setStatus('Connected');
        setError('');
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'initialData':
              if (data.recentArticles) {
                setArticles(data.recentArticles);
                // Only set the initial count once when first receiving the data
                if (!initialDataReceived) {
                  setInitialArticleCount(data.recentArticlesCount || data.recentArticles.length);
                  setInitialDataReceived(true);
                }
                setLoading(false);
              }
              break;
            
            case 'articleUpdate':
              if (data.articles) {
                setArticles(data.articles);
                setLoading(false);
              }
              break;
            
            default:
              console.warn('Unknown message type received:', data);
          }
        } catch (error) {
          setError('Error parsing data from server');
          console.error('WebSocket message parsing error:', error);
        }
      };

      socket.onclose = () => {
        setStatus('Disconnected');
        setWs(null);
        setInitialDataReceived(false);
        setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        setStatus('Error');
        setError('WebSocket connection error');
      };

    } catch (error) {
      setStatus('Error');
      setError(error instanceof Error ? error.message : 'Failed to connect');
      setTimeout(connect, 3000);
    }
  }, [initialDataReceived]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        return Math.min(oldProgress + 10, 100);
      });

      setBuffer((oldBuffer) => {
        if (oldBuffer === 100) {
          return 30;
        }
        return Math.min(oldBuffer + 10, 100);
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md mb-4 p-4 border border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">HackerNews Live Feed</h1>
          <div className="flex flex-col items-end">
            <span className={`text-sm ${
              status === 'Connected' ? 'text-green-600' : 
              status === 'Disconnected' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              {status}
            </span>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Initial articles since last connection: <strong>{initialArticleCount}</strong>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2">
            <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {articles.map((article, index) => (
            <div 
              key={index} 
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 m-2 mx-8"
            >
              <h3 className="font-medium mb-2 line-clamp-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 flex items-start gap-2"
                >
                  {article.title}
                  <span className="inline-block w-4 h-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </span>
                  {article.score.replace(' points', '')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Updates every 5 mins
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}