'use client'
import React, { useState } from "react";
import HackerNewsBoard from "./components/news-board";
import { Newspaper, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { DotBackgroundDemo } from "./components/ui/grid-dot-background";


export default function Page(){
  return (
    <>
        <DotBackgroundDemo/>
         {/* <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Last updated: 
          </p>
          <button
            
            className="flex items-center gap-2 px-4 py-2 bg-white-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
        </div> */}
      {/* <HackerNewsBoard/> */}
          {/* <div className="text-white flex items-center justify-center w-full h-full text-center">
      Tired of browsing HackerNews manually?<br />
      Get the top stories from the last 5 minutes right here — instantly!
    </div> */}
    </>
  );
}
