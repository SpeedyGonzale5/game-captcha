'use client';

import { motion } from 'framer-motion';

export default function ScoreDisplay({ 
  score = 0, 
  targetScore = 3, 
  gameWon = false,
  className = "" 
}) {
  const displayText = gameWon 
    ? "🎉 MISSION COMPLETE! 🎉"
    : `ENEMIES DESTROYED: ${score}/${targetScore}`;

  return (
    <motion.div 
      className={`
        text-green-400 font-mono text-base font-bold mb-3
        drop-shadow-neon-green text-center
        ${gameWon ? 'animate-blink' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {gameWon ? (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          {displayText}
        </motion.div>
      ) : (
        displayText
      )}
    </motion.div>
  );
}