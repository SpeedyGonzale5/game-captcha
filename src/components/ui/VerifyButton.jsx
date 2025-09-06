'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function VerifyButton({ 
  disabled = false, 
  onClick,
  score = 0,
  targetScore = 3,
  isVerifying = false,
  className = ""
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getButtonText = () => {
    if (isVerifying) return '⏳ Creating Masterpiece...';
    if (score < targetScore) return `🎨 Complete Your Drawing`;
    return '🎨 Submit Drawing';
  };

  const getButtonStyle = () => {
    if (disabled || score < targetScore) {
      return 'backdrop-blur-md bg-white/10 text-white/40 cursor-not-allowed border border-white/10';
    }
    return 'backdrop-blur-md bg-gradient-to-br from-emerald-500/80 to-green-600/80 hover:from-emerald-400/90 hover:to-green-500/90 text-white shadow-button-3d hover:shadow-glass-hover cursor-pointer border border-white/20';
  };

  return (
    <motion.button
      className={`
        w-full py-4 px-8 rounded-2xl font-bold text-lg
        uppercase tracking-wider transition-all duration-300
        ${getButtonStyle()}
        ${className}
      `}
      onClick={disabled || score < targetScore ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isVerifying}
      whileHover={!disabled && score >= targetScore ? { 
        scale: 1.02,
        y: -3
      } : {}}
      whileTap={!disabled && score >= targetScore ? { 
        scale: 0.98,
        y: 0
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.span
        animate={isVerifying ? { 
          opacity: [1, 0.5, 1] 
        } : {}}
        transition={isVerifying ? { 
          duration: 1, 
          repeat: Infinity 
        } : {}}
      >
        {getButtonText()}
      </motion.span>
    </motion.button>
  );
}