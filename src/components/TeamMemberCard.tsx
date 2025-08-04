"use client";
import React, { useRef, useState, useEffect } from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

type TeamMember = {
  name: string;
  designation: string;
  image1: string;
  image2: string;
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
};

const TeamMemberCard = ({ member, isDarkMode }: { member: TeamMember, isDarkMode: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentOffset({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset offset to trigger snap-back animation
    setCurrentOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPosition]);

  const handleImageClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      ref={cardRef}
      className={`
        rounded-lg shadow-sm border p-5 text-center transition-shadow duration-300 relative
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        hover:shadow-lg z-10 cursor-grab
      `}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        touchAction: 'none'
      }}
    >
      <div
        className="mb-7 relative w-[120px] h-[120px] mx-auto rounded-full"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-full"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <img
            src={member.image1}
            alt={`Front of ${member.name}`}
            className="absolute w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 cursor-pointer [backface-visibility:hidden]"
            onClick={handleImageClick}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/120x120/E5E7EB/6B7280?text=👤";
            }}
          />
          <img
            src={member.image2}
            alt={`Back of ${member.name}`}
            className="absolute w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 cursor-pointer [backface-visibility:hidden]"
            onClick={handleImageClick}
            style={{ transform: "rotateY(180deg)" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/120x120/E5E7EB/6B7280?text=👤";
            }}
          />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
        {member.name}
      </h3>
      <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
        {member.designation}
      </p>
      <div className="flex justify-center gap-3">
        {member.socials.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-2 rounded-md transition-colors duration-200
              ${isDarkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}
            `}
            aria-label={`LinkedIn profile of ${member.name}`}
          >
            <FaLinkedin size={20} />
          </a>
        )}
        {member.socials.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-2 rounded-md transition-colors duration-200
              ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
            `}
            aria-label={`GitHub profile of ${member.name}`}
          >
            <FaGithub size={20} />
          </a>
        )}
        {member.socials.twitter && (
          <a
            href={member.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-2 rounded-md transition-colors duration-200
              ${isDarkMode ? 'text-gray-400 hover:text-blue-300 hover:bg-gray-700' : 'text-gray-500 hover:text-blue-400 hover:bg-blue-50'}
            `}
            aria-label={`Twitter profile of ${member.name}`}
          >
            <FaTwitter size={20} />
          </a>
        )}
        {member.socials.instagram && (
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-2 rounded-md transition-colors duration-200
              ${isDarkMode ? 'text-gray-400 hover:text-pink-400 hover:bg-gray-700' : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'}
            `}
            aria-label={`Instagram profile of ${member.name}`}
          >
            <FaInstagram size={20} />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
