// "use client";

// import React from "react";
// import Image from "next/image";
// import { useTheme } from "next-themes";
// import { MoonIcon, SunIcon } from "lucide-react";

// const Navbar = () => {
//   const { theme, setTheme } = useTheme();

//   return (
//     <div className="flex justify-between items-center border border-black/10 dark:border-white/10  dark:bg-white/5 backdrop-blur-md p-5 h-20 rounded-xl shadow-lg transition-all" suppressHydrationWarning>
//       <div className="text-black dark:text-white p-2 flex items-center gap-3">
//         <Image src="/nowFeed.png" alt="NowFeed Logo" width={40} height={40} />
//         <span className="text-xl font-semibold">NowFeed</span>
//       </div>
//       <button
//         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//         className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-black dark:text-white ml-4"
//         aria-label="Toggle Theme"
//       >
//         {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
//       </button>
//     </div>
//   );
// };

// export default Navbar;


"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      const currentTheme = theme === "system" ? (darkQuery.matches ? "dark" : "light") : theme;
      setIsDarkMode(currentTheme === "dark");
    };

    updateTheme(); // Initial check
    darkQuery.addEventListener("change", updateTheme);

    return () => darkQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  if (!mounted) return null;

  return (
    <div className="flex justify-between items-center border border-black/10 dark:border-white/10 dark:bg-white/5 backdrop-blur-md p-5 h-20 rounded-xl shadow-lg transition-all">
      <div className="text-black dark:text-white p-2 flex items-center gap-3">
        <Image src="/nowFeed.png" alt="NowFeed Logo" width={40} height={40} />
        <span className="text-xl font-semibold">NowFeed</span>
      </div>
      <button
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-black dark:text-white ml-4"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default Navbar;
