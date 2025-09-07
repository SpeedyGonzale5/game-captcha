'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ImageSkeleton, AudioSkeleton, TextSkeleton, OverlaySkeleton } from './SkeletonLoader';

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
  const [showEnhanced, setShowEnhanced] = useState(false);
  const audioRef = useRef(null);

  // Auto-play audio when it becomes available
  useEffect(() => {
    if (audioGenerated && audioUrl && audioUrl !== "#" && audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.play().catch(error => {
        console.log("Auto-play failed:", error);
      });
    }
  }, [audioGenerated, audioUrl]);

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

      {/* Main Image Display with Overlay */}
      <div className="relative mb-8">
        <motion.div
          className="relative w-full max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Background Original Drawing */}
          <div className="relative aspect-square bg-white rounded-2xl shadow-lg border border-gray-200 p-6 overflow-hidden">
            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
              {originalDrawing && (
                <Image 
                  src={originalDrawing} 
                  alt="User's original drawing" 
                  width={400} 
                  height={400} 
                  className="rounded-lg object-contain w-full h-full" 
                />
              )}
            </div>
            
            {/* Overlay Skeleton or Enhanced Image */}
            <AnimatePresence>
              {!imageGenerated ? (
                <OverlaySkeleton key="overlay-skeleton" />
              ) : generatedArtwork && showEnhanced && (
                <motion.div
                  key="enhanced-overlay"
                  className="absolute inset-0 p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, type: "spring" }}
                  drag="x"
                  dragConstraints={{ left: -100, right: 100 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 50) {
                      setShowEnhanced(false);
                    } else if (info.offset.x < -50) {
                      setShowEnhanced(true);
                    }
                  }}
                >
                  <div className="relative w-full h-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden group cursor-grab active:cursor-grabbing">
                    <Image 
                      src={generatedArtwork} 
                      alt={`AI generated artwork for prompt: ${prompt}`} 
                      width={400} 
                      height={400} 
                      className="rounded-lg object-cover w-full h-full" 
                    />
                    
                    {/* Swipe hint */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Swipe to compare
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Toggle buttons */}
          {imageGenerated && generatedArtwork && (
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setShowEnhanced(false)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  !showEnhanced 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setShowEnhanced(true)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  showEnhanced 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Enhanced
              </button>
            </motion.div>
          )}
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
                    <audio ref={audioRef} controls className="w-full">
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