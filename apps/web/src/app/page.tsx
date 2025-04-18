// import React from "react";
// import { cn } from "../../lib/utils";
// import HackerNewsBoard from "./components/news-board";
// import Navbar from "./components/Navbar";

// export default function HomePage() {
//   return (
//     <div>
//       <div className="relative h-screen w-full bg-white overflow-hidden dark:bg-black">
//         <div
//           className={cn(
//             "absolute inset-0",
//             "[background-size:20px_20px]",
//             "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
//             "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
//           )}
//         />
//         <div className="relative z-10 w-2/3 mx-auto p-7">
//           <Navbar />
//           <div className="text-white py-10">
//             <HackerNewsBoard />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useTheme } from "next-themes";
import Navbar from "./components/Navbar";
import HackerNewsBoard from "./components/news-board";
import { cn } from "../../lib/utils";

export default function PageWrapper() {
  const { theme } = useTheme();

  return (
    <div>
      <div
        className={cn(
          "relative h-screen w-full overflow-hidden",
          theme === "dark"
            ? "bg-black"
            : "bg-gradient-to-r from-[#dfe2fe] via-[#b1cbfa] to-[#8e98f5]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#492500_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
          )}
        />
        <div className="relative z-10 w-2/3 mx-auto p-7">
          <Navbar />
          <div className="py-10 text-black dark:text-white">
            <HackerNewsBoard/>
          </div>
        </div>
      </div>
    </div>
  );
}
