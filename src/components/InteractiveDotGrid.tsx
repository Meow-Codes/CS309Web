// components/InteractiveDotGrid.tsx
"use client";
import React, { useRef, useEffect, useCallback } from "react";

// Props interface for better typing
interface InteractiveDotGridProps {
  isDarkMode: boolean;
}

// Particle interface for storing dot properties
interface Particle {
  x: number;
  y: number;
  baseRadius: number;
}

const InteractiveDotGrid: React.FC<InteractiveDotGridProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  // Constants
  const SPACING = 40;
  const MAX_RADIUS = 2;
  const MAX_DISTANCE = 100;

  // Colors based on dark mode
  const getColors = useCallback(() => ({
    background: isDarkMode ? "rgba(26, 32, 44, 1)" : "rgba(255, 255, 255, 1)",
    dot: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    dotActive: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
  }), [isDarkMode]);

  // Debounce utility for resize events
  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

  // Initialize or update particles
  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    for (let y = 0; y < canvas.height + SPACING; y += SPACING) {
      for (let x = 0; x < canvas.width + SPACING; x += SPACING) {
        particles.push({ x, y, baseRadius: MAX_RADIUS });
      }
    }
    particlesRef.current = particles;
  }, []);

  // Set canvas size
  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    updateParticles();
  }, [updateParticles]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const { background, dot, dotActive } = getColors();

    // Clear canvas with background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    const { x: mouseX, y: mouseY } = mouseRef.current;
    particlesRef.current.forEach((particle) => {
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const newRadius = Math.max(0.5, MAX_RADIUS - (distance / MAX_DISTANCE) * MAX_RADIUS);

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, newRadius, 0, Math.PI * 2);
      ctx.fillStyle = distance < MAX_DISTANCE ? dotActive : dot;
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [getColors]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Initialize effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas size
    setCanvasSize();

    // Add event listeners
    window.addEventListener("resize", debounce(setCanvasSize, 100));
    canvas.addEventListener("mousemove", handleMouseMove);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debounce(setCanvasSize, 100));
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setCanvasSize, handleMouseMove, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-auto"
    />
  );
};

export default InteractiveDotGrid;