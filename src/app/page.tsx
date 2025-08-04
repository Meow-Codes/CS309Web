// app/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100 });

  // Persist dark mode with localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", handleMouseMove);

    const SPACING = 40;
    const BASE_RADIUS = 1; // Default radius for all dots
    const MAX_RADIUS = 3; // Larger radius when mouse is near
    const MAX_DISTANCE = 100;

    const animate = () => {
      if (!ctx) return;

      const { background, dot, dotActive } = {
        background: isDarkMode ? "rgba(26, 32, 44, 1)" : "rgba(255, 255, 255, 1)",
        dot: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        dotActive: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
      };

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y += SPACING) {
        for (let x = 0; x < canvas.width; x += SPACING) {
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radiusFactor = Math.min(1, MAX_DISTANCE / (distance + 1)); // Avoid division by zero
          const radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * radiusFactor;
          const opacity = 0.1 + 0.7 * radiusFactor; // Increase opacity near mouse

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isDarkMode]);

  return (
    <div className="relative min-h-screen overflow-visible">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[-10] pointer-events-auto"
        style={{ width: "100vw", height: "100vh" }}
      />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto px-6 py-24 text-center flex-grow">
          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-200 mb-4">
            Data Analysis Project
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-700 dark:text-gray-400">
            Explore our work in statistical analysis, hypothesis testing, and data-driven insights.
            This interactive background is just a small taste of our creativity and technical skills.
          </p>
        </main>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}