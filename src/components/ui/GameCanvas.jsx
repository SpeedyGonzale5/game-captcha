'use client';

import { forwardRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const GameCanvas = forwardRef(({ 
  width = 350, 
  height = 200, 
  onMouseMove,
  onClick,
  className = "",
  children,
  ...props 
}, ref) => {
  
  const handleMouseMove = useCallback((e) => {
    if (onMouseMove) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onMouseMove({ x, y, timestamp: Date.now() });
    }
  }, [onMouseMove]);

  const handleClick = useCallback((e) => {
    if (onClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onClick({ x, y, timestamp: Date.now() });
    }
  }, [onClick]);

  return (
    <motion.div
      ref={ref}
      className={`
        relative overflow-hidden cursor-crosshair
        bg-gradient-to-b from-sky-300 via-green-500 to-amber-800
        rounded-lg border-2 border-gray-700 shadow-lg
        ${className}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-200 to-green-400" />
      
      {/* Ground area */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-green-600 to-amber-900" />
      
      {/* Game elements container */}
      <div className="absolute inset-0">
        {children}
      </div>
      
      {/* Aiming crosshair (optional) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white transform -translate-x-1/2" />
        </div>
      </div>
    </motion.div>
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;