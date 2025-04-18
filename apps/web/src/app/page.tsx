"use client";

import Navbar from "./components/Navbar";
import HackerNewsBoard from "./components/news-board";
import { cn } from "../../lib/utils";
import Footer from "./components/Footer";

export default function PageWrapper() {
  return (
    <div>
      <div className="relative min-h-screen  w-full  bg-gradient-to-r from-[#dfe2fe] via-[#b1cbfa] to-[#8e98f5] dark:bg-black dark:bg-none">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#492500_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
          )}
        />
        <div className="relative z-10 w-2/3 mx-auto p-7 overflow-hidden">
          <Navbar />
          <div className="py-10 text-black dark:text-white">
            <HackerNewsBoard/>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
