
import React from "react";
import { cn } from "../../../../lib/utils";
import { RefreshCw } from "lucide-react";
import HackerNewsBoard from "../news-board";

export function DotBackgroundDemo() {
  return (
    <div>
      <div className="relative h-screen w-full bg-white overflow-hidden dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
          )}
        />

        <div className="relative z-10 w-2/3 mx-auto p-7">
          <div className="flex justify-between border border-white/10 bg-white/10 bg-gradient-to-br from-white/10 to-white/5 dark:bg-white/5 backdrop-blur-none p-5 h-20 rounded-xl shadow-lg">
            <div className="text-white p-2">Your Top Stories</div>
            <button className="flex items-center gap-2 px-4 p-2 bg-zinc-800 text-white rounded-lg">
              <RefreshCw /> Refresh
            </button>
          </div>

          <div className="text-white py-10"><HackerNewsBoard/></div>
        </div>
      </div>
    </div>
  );
}
