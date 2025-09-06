'use client';

import { motion } from 'framer-motion';

export default function Bullet({ 
  x = 0, 
  y = 0, 
  width = 4,
  height = 8,
  id,
  className = ""
}) {
  return (
    <motion.div
      className={`
        absolute bg-yellow-400 rounded-sm
        shadow-neon-yellow
        ${className}
      `}
      style={{ 
        left: x + 'px', 
        bottom: y + 'px',
        width: width + 'px',
        height: height + 'px'
      }}
      initial={{ 
        scale: 0.5,
        opacity: 0 
      }}
      animate={{ 
        scale: 1,
        opacity: 1
      }}
      exit={{
        scale: 0,
        opacity: 0
      }}
      transition={{ duration: 0.1 }}
    />
  );
}