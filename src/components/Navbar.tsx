"use client";
import React from "react";
import { FaMoon, FaSun, FaFlask } from "react-icons/fa";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <nav
      className={`py-4 shadow-md ${
        isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center">
            <FaFlask size={24} className={` ${isDarkMode ? "text-yellow-300" : "text-blue-600"}`} />
          </a>
          <a href="/">
            <span className={`font-medium hover:text-yellow-500 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } transition-colors duration-300`}>
              Fantastic 4
              </span>
          </a>
        </div>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className={`font-medium hover:text-yellow-500 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } hover:underline transition-colors duration-300`}
          >
            Home
          </a>
          <a
            href="/about"
            className={`font-medium hover:text-yellow-500 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } hover:underline transition-colors duration-300`}
          >
            About
          </a>

          {/* Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
              isDarkMode
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
