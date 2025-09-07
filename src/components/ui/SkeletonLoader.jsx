'use client';

import { motion } from 'framer-motion';

export const ImageSkeleton = ({ className = "" }) => {
  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle sway animation */}
      <motion.div
        className="w-full h-full bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-lg"
        animate={{
          scale: [1, 1.02, 1],
          rotate: [0, 0.5, 0, -0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Loading icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export const AudioSkeleton = ({ className = "" }) => {
  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-r from-green-100 via-blue-50 to-purple-100 rounded-lg p-3 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Audio waveform skeleton */}
      <div className="flex items-center gap-1">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-blue-300 to-purple-300 rounded-full"
            style={{ width: '4px' }}
            animate={{
              height: ['8px', '24px', '8px'],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
        <motion.span
          className="ml-2 text-sm text-gray-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Composing music...
        </motion.span>
      </div>
    </motion.div>
  );
};

export const TextSkeleton = ({ lines = 2, className = "" }) => {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded overflow-hidden"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
