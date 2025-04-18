'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

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
  const [loading, setLoading] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<string>('Connecting ..');

  const connect = useCallback(() => {
    console.log("WebSocket connecting...");
    const socket = new WebSocket('ws://localhost:3001');
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setStatus('Connected');
    };

    socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        switch (data.type) {
          case 'initialData':
            if (data.recentArticles) {
              setArticles(data.recentArticles);
              setLoading(false);
            }
            break;
          case 'articleUpdate':
            if (data.articles) {
              const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
              const filteredArticles = data.articles.filter(
                (article) => new Date(article.publishedAt) > fiveMinutesAgo
              );
              setArticles(filteredArticles);
              setLoading(false);
            }
            break;
          default:
            console.warn('Unknown message type received:', data);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected, reconnecting...");
      setStatus('Disconnected');
      setTimeout(connect, 1000);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setStatus('Error');
    };
  }, []);

  useEffect(() => {
    console.log("Component mounted");
    connect();
    return () => {
      wsRef.current?.close();
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
       <p>Loading your Articles...</p>
     </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {articles.map((article, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 dark:from-white/10 dark:to-white/0 border border-black/50 dark:border-white/10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
            >
              <h3 className="dark:text-white text-black font-semibold mb-3 text-lg leading-snug line-clamp-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:hover:text-amber-400 hover:text-teal-500 flex items-start gap-2"
                >
                  {article.title}
                  <span className="inline-block w-4 h-4 mt-1 dark:text-cyan-400 text-amber-200">
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
  
              <div className="flex flex-wrap gap-4 text-sm dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 dark:text-yellow-400 text-teal-500">
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
                  <span className="inline-block w-4 h-4 dark:text-green-400 text-teal-500">
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





// 'use client';

// import React, { useEffect, useState, useCallback, useRef } from 'react';

// interface Article {
//   title: string;
//   link: string;
//   score: string;
//   publishedAt: string;
// }

// interface WebSocketMessage {
//   type: 'initialData' | 'articleUpdate';
//   articles?: Article[];
//   recentArticles?: Article[]; 
//   recentArticlesCount?: number;
// }

// export default function HackerNewsBoard() {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const wsRef = useRef<WebSocket | null>(null);
//   const [status, setStatus] = useState<string>('Connecting ..');

//   const connect = useCallback(() => {
//     const socket = new WebSocket('ws://localhost:3001');
//     wsRef.current = socket;

//     socket.onopen = () => setStatus('Connected');
//     socket.onmessage = (event) => {
//       try {
//         const data: WebSocketMessage = JSON.parse(event.data);
//         if (data.type === 'initialData' && data.recentArticles) {
//           setArticles(data.recentArticles);
//           setLoading(false);
//         } else if (data.type === 'articleUpdate' && data.articles) {
//           const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
//           const filtered = data.articles.filter(
//             (a) => new Date(a.publishedAt) > fiveMinutesAgo
//           );
//           setArticles(filtered);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error('Parsing error:', err);
//       }
//     };

//     socket.onclose = () => {
//       setStatus('Disconnected');
//       setTimeout(connect, 1000);
//     };

//     socket.onerror = (err) => {
//       console.error('WebSocket error:', err);
//       setStatus('Error');
//     };
//   }, []);

//   useEffect(() => {
//     connect();
//     return () => wsRef.current?.close();
//   }, [connect]);

//   return (
//     <div className="container mx-auto px-6 py-8 min-h-screen">
//       {loading ? (
//         <div className="flex flex-col justify-center items-center min-h-screen">
//           <div className="relative w-[200px] h-[60px] z-[1]">
//             {[15, 45, 85].map((pos, i) => (
//               <div
//                 key={i}
//                 className={`absolute w-5 h-5 bg-black dark:bg-white rounded-full left-[${pos}%] animate-bounce-circle ${i > 0 ? `[animation-delay:0.${i}s]` : ''}`}
//               />
//             ))}
//             {[15, 45, 85].map((pos, i) => (
//               <div
//                 key={`shadow-${i}`}
//                 className={`absolute w-5 h-1 rounded-full bg-black dark:bg-white top-[62px] ${pos === 85 ? 'right-[15%]' : `left-[${pos}%]`} z-[-1] blur-sm animate-shadow-scale ${i > 0 ? `[animation-delay:0.${i}s]` : ''}`}
//               />
//             ))}
//           </div>
//           <p className="text-black dark:text-white mt-4">Loading your Articles...</p>
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
//           {articles.map((article, index) => (
//             <div
//               key={index}
//               className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-md dark:shadow-xl hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 p-6"
//             >
//               <h3 className="text-gray-900 dark:text-white font-semibold mb-3 text-lg leading-snug line-clamp-2">
//                 <a
//                   href={article.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:text-amber-500 flex items-start gap-2"
//                 >
//                   {article.title}
//                   <span className="inline-block w-4 h-4 mt-1 text-blue-600 dark:text-cyan-400">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                       />
//                     </svg>
//                   </span>
//                 </a>
//               </h3>

//               <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
//                 <span className="flex items-center gap-1">
//                   <span className="text-yellow-500 dark:text-yellow-400">
//                     ⬆
//                   </span>
//                   {article.score.replace(" points", "")}
//                 </span>

//                 <span className="flex items-center gap-1">
//                   🕒 {new Date(article.publishedAt).toLocaleTimeString()}
//                 </span>

//                 <span className="flex items-center gap-1">
//                   <span className="text-green-600 dark:text-green-400">🔄</span>
//                   Updates every 5 mins
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
