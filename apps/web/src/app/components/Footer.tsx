"use client";

import React from "react";
import { Github, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className=" px-4 py-6 w-full border-t border-gray-300 bg-purple-200 dark:border-white/10 dark:bg-black/50 backdrop-blur-md shadow-inner  transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm dark:text-gray-300 text-gray-700">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} NowFeed — Built with ❤️ for real-time news lovers.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/prynsh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500 dark:hover:text-amber-400 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/priyanshhverma/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500 dark:hover:text-amber-400 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          {/* <a
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500 dark:hover:text-amber-400 transition-colors"
            aria-label="Website"
          >
            <Globe className="w-5 h-5" />
          </a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
