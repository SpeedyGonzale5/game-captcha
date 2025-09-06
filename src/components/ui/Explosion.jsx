'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Explosion({ 
  x = 0, 
  y = 0,
  id,
  onComplete,
  className = ""
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete && onComplete(id);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`
        absolute text-2xl select-none pointer-events-none
        transform -translate-x-1/2 -translate-y-1/2
        ${className}
      `}
      style={{ 
        left: x + 'px', 
        top: y + 'px'
      }}
      initial={{ 
        scale: 0,
        opacity: 1,
        rotate: 0
      }}
      animate={{ 
        scale: [0, 1.5, 2],
        opacity: [1, 0.8, 0],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      💥
    </motion.div>
  );
}