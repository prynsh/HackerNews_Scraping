'use client';

import { LinearProgress } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';

interface Article {
  title: string;
  link: string;
  score: string;
  publishedAt: string;
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
                if (!initialDataReceived) {
                  setInitialArticleCount(data.recentArticlesCount || data.recentArticles.length);
                  setInitialDataReceived(true);
                }
                setLoading(false);
              }
              break;
            
            case 'articleUpdate':
              if (data.articles) {
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                const filteredArticles = data.articles.filter((article) =>
                  new Date(article.publishedAt) > fiveMinutesAgo
                );
                setArticles(filteredArticles);
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
        setTimeout(connect, 1000);
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
    <div className="container mx-auto px-6 py-8 min-h-screen">
      {loading ? (
       <div className="flex justify-center items-center min-h-screen">
       <div className="relative w-[200px] h-[60px] z-[1]">
         <div className="absolute w-5 h-5 bg-white rounded-full left-[15%] animate-bounce-circle"></div>
         <div className="absolute w-5 h-5 bg-white rounded-full left-[45%] animate-bounce-circle [animation-delay:0.2s]"></div>
         <div className="absolute w-5 h-5 bg-white rounded-full right-[15%] animate-bounce-circle [animation-delay:0.3s]"></div>
   
         <div className="absolute w-5 h-1 rounded-full bg-black top-[62px] left-[15%] z-[-1] blur-sm animate-shadow-scale"></div>
         <div className="absolute w-5 h-1 rounded-full bg-black top-[62px] left-[45%] z-[-1] blur-sm animate-shadow-scale [animation-delay:0.2s]"></div>
         <div className="absolute w-5 h-1 rounded-full bg-black top-[62px] right-[15%] z-[-1] blur-sm animate-shadow-scale [animation-delay:0.3s]"></div>
       </div>
     </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {articles.map((article, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 dark:from-white/10 dark:to-white/0 border border-white/20 dark:border-white/10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
            >
              <h3 className="text-white font-semibold mb-3 text-lg leading-snug line-clamp-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 flex items-start gap-2"
                >
                  {article.title}
                  <span className="inline-block w-4 h-4 mt-1 text-cyan-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </a>
              </h3>
  
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </span>
                  {article.score.replace(" points", "")}
                </span>
  
                <span>🕒 {new Date(article.publishedAt).toLocaleTimeString()}</span>
  
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 text-green-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
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