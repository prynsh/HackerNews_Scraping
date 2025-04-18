import React from "react";
import { cn } from "../../lib/utils";
import HackerNewsBoard from "./components/news-board";
import Navbar from "./components/Navbar";

export default function HomePage() {
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
          <Navbar />
          <div className="text-white py-10">
            <HackerNewsBoard />
          </div>
        </div>
      </div>
    </div>
  );
}
