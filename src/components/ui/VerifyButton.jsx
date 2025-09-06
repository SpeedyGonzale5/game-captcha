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
    if (isVerifying) return '⏳ Verifying Human Skills...';
    if (score < targetScore) return `🎮 Destroy ${targetScore - score} More Enemies`;
    return '🎮 Verify Gaming Skills';
  };

  const getButtonStyle = () => {
    if (disabled || score < targetScore) {
      return 'bg-gray-400 cursor-not-allowed opacity-60';
    }
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 cursor-pointer shadow-lg hover:shadow-xl';
  };

  return (
    <motion.button
      className={`
        w-full py-4 px-8 rounded-2xl text-white font-bold text-lg
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
        y: -2
      } : {}}
      whileTap={!disabled && score >= targetScore ? { 
        scale: 0.98 
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