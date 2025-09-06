'use client';

import { motion } from 'framer-motion';

export default function Player({ 
  x = 50, 
  y = 20, 
  size = 30,
  className = ""
}) {
  return (
    <motion.div
      className={`
        absolute bg-red-500 rounded-full border-2 border-white
        shadow-lg transform -translate-x-1/2 -translate-y-1/2
        ${className}
      `}
      style={{ 
        left: x + 'px', 
        bottom: y + 'px',
        width: size + 'px',
        height: size + 'px'
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 15
      }}
      whileHover={{ scale: 1.1 }}
    />
  );
}