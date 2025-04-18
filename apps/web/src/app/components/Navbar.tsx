// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";

// const Navbar = () => {
//   const [lastUpdate, setLastUpdate] = useState(new Date());
//   const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       const seconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
//       setSecondsSinceUpdate(seconds);

//       if (seconds >= 300) {
//         setLastUpdate(now);
//         setSecondsSinceUpdate(0);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [lastUpdate]);

//   return (
//     <div className="flex justify-between border border-white/10 bg-white/10 bg-gradient-to-br from-white/10 to-white/5 dark:bg-white/5 backdrop-blur-none p-5 h-20 rounded-xl shadow-lg">
//       <div className="text-white p-2 flex items-center gap-3">
//         <Image src="/nowFeed.png" alt="NowFeed Logo" width={40} height={40} />
//         <span className="text-xl font-semibold">NowFeed</span>
//       </div>
//       <span className="flex text-white items-center gap-1 text-sm">
//         <span className="inline-block w-4 h-4 text-green-400">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         </span>
//         {(() => {
//           const remaining = 300 - secondsSinceUpdate;
//           const minutes = Math.floor(remaining / 60);
//           const seconds = remaining % 60;
//           return `Updates in ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//         })()}
//       </span>
//     </div>
//   );
// };

// export default Navbar;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

const Navbar = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
      setSecondsSinceUpdate(seconds);

      if (seconds >= 300) {
        setLastUpdate(now);
        setSecondsSinceUpdate(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const remaining = 300 - secondsSinceUpdate;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex justify-between items-center border border-white/10 bg-white/10 bg-gradient-to-br from-white/10 to-white/5 dark:bg-white/5 backdrop-blur-none p-5 h-20 rounded-xl shadow-lg">
      {/* Logo */}
      <div className="text-white p-2 flex items-center gap-3">
        <Image src="/nowFeed.png" alt="NowFeed Logo" width={40} height={40} />
        <span className="text-xl font-semibold">NowFeed</span>
      </div>

     
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors text-white ml-4"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default Navbar;
