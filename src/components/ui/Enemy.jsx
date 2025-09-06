'use client';

import { motion } from 'framer-motion';

export default function Enemy({ 
  x = 0, 
  y = 0, 
  size = 25,
  id,
  onDestroy,
  className = ""
}) {
  return (
    <motion.div
      className={`
        absolute bg-transparent text-xl select-none
        transform -translate-x-1/2 -translate-y-1/2
        ${className}
      `}
      style={{ 
        left: x + 'px', 
        top: y + 'px',
        width: size + 'px',
        height: size + 'px',
        fontSize: '20px'
      }}
      initial={{ 
        scale: 0,
        rotate: 0
      }}
      animate={{ 
        scale: 1,
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        scale: {
          type: "spring",
          stiffness: 500,
          damping: 15
        },
        rotate: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      exit={{
        scale: 0,
        rotate: 180,
        opacity: 0
      }}
    >
      👾
    </motion.div>
  );
}