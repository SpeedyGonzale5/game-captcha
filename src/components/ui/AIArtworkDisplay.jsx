'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageSkeleton, AudioSkeleton, TextSkeleton } from './SkeletonLoader';

const AIArtworkDisplay = ({
  originalDrawing,
  generatedArtwork,
  prompt,
  audioUrl,
  isGenerating = false,
  imageGenerated = false,
  audioGenerated = false,
  className = ""
}) => {

  return (
    <div className={`w-full ${className}`}>
      <div className="text-center mb-8">
        <motion.div
          className="inline-block mb-4 text-3xl"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 20 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
        >
          🎉
        </motion.div>
        <motion.h2 
          className="text-3xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your Creative Masterpiece!
        </motion.h2>
        <motion.p 
          className="text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Human creativity verified through your unique &quot;{prompt}&quot; drawing
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Original Drawing Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">Your Original Drawing</h3>
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            {originalDrawing && (
              <Image src={originalDrawing} alt="User's original drawing" width={300} height={300} className="rounded-md object-contain" />
            )}
          </div>
        </motion.div>

        {/* AI Enhanced Version Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">AI Enhanced Version</h3>
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {!imageGenerated ? (
                <ImageSkeleton key="image-skeleton" className="w-full h-full" />
              ) : generatedArtwork ? (
                <motion.div
                  key="generated-image"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Image 
                    src={generatedArtwork} 
                    alt={`AI generated artwork for prompt: ${prompt}`} 
                    width={300} 
                    height={300} 
                    className="rounded-md object-cover w-full h-full" 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="image-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 p-4"
                >
                  <p className="text-sm">Image generation failed</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-xs text-blue-500 hover:underline mt-1"
                  >
                    Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* AI Info Card */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
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
            <div className="flex-1">
              <p className="font-semibold text-gray-700">ElevenLabs Audio</p>
              <AnimatePresence mode="wait">
                {!audioGenerated && !audioUrl ? (
                  <AudioSkeleton key="audio-skeleton" className="mt-2" />
                ) : audioUrl && audioUrl !== "#" ? (
                  <motion.div
                    key="audio-player"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-2"
                  >
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </motion.div>
                ) : (
                  <motion.div
                    key="audio-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1"
                  >
                    <p className="text-sm text-gray-500">Music generation failed</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIArtworkDisplay;