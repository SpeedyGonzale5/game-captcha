'use client';

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1920, // Default size to avoid hydration mismatch
    height: 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size after component mounts
    handleResize();
    
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const Component = () => {
  const { width, height } = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render UnicornScene until after hydration
  if (!isMounted) {
    return (
      <div className={cn("w-full h-full min-h-screen bg-black")}>
        {/* Placeholder while loading */}
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full min-h-screen")}>
        <UnicornScene 
          production={true} 
          projectId="MiiqZiDaKUOWbdlhlARE" 
          width={width} 
          height={height}
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
    </div>
  );
};
