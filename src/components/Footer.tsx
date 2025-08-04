// components/Footer.jsx
import React from 'react';
import { FaCcAmazonPay, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`py-8 ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4 text-sm">&copy; 2025 Fantastic 4. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-200 hover:text-yellow-500 ${isDarkMode ? 'hover:text-blue-400' : ''}`}
            aria-label="LinkedIn Profile"
          >
            <span>About Us</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;