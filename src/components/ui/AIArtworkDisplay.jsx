'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const AIArtworkDisplay = ({
  originalDrawing,
  generatedArtwork,
  prompt,
  isGenerating,
  className = ""
}) => {
  if (isGenerating) {
    return null; // The loading state is now handled in DrawingGame.jsx
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4 text-3xl"
        >
          🎉
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your Creative Masterpiece!
        </motion.h2>
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Human creativity verified through your unique &quot;{prompt}&quot; drawing
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Original Drawing Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">Your Original Drawing</h3>
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            {originalDrawing && (
              <Image
                src={originalDrawing}
                alt="User's original drawing"
                width={300}
                height={300}
                className="rounded-md object-contain"
              />
            )}
          </div>
        </motion.div>

        {/* AI Enhanced Version Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">AI Enhanced Version</h3>
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {generatedArtwork && (
              <Image
                src={generatedArtwork}
                alt={`AI generated artwork for prompt: ${prompt}`}
                width={300}
                height={300}
                className="rounded-md object-cover"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Info Card */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="font-semibold text-gray-700">Nano Banana AI</p>
              <p className="text-sm text-gray-500">Enhanced your drawing with professional artistic styling</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎵</span>
            <div>
              <p className="font-semibold text-gray-700">ElevenLabs Audio</p>
              <button className="text-sm text-blue-500 hover:underline">Play Theme Music</button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Verification Button */}
      <div className="text-center pt-2">
        <motion.div
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold text-sm py-2 px-4 rounded-lg shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Human Creativity Verified!</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AIArtworkDisplay;