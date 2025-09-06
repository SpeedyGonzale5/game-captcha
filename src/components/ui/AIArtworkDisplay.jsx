'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AIArtworkDisplay({
  originalDrawing,
  generatedArtwork,
  prompt,
  isGenerating = false,
  onComplete,
  className = ""
}) {
  const [showArtwork, setShowArtwork] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (generatedArtwork && !isGenerating) {
      setTimeout(() => {
        setShowArtwork(true);
        if (onComplete) onComplete();
      }, 500);
    }
  }, [generatedArtwork, isGenerating, onComplete]);

  const playBackgroundMusic = () => {
    setAudioPlaying(true);
    // Mock audio play - in real implementation, would play generated music
    setTimeout(() => setAudioPlaying(false), 30000); // 30 second demo
  };

  if (isGenerating) {
    return (
      <motion.div 
        className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🎨
        </motion.div>
        <h3 className="text-xl font-bold text-purple-800 mb-2">
          Creating Your Masterpiece...
        </h3>
        <p className="text-purple-600 mb-4">
          AI is transforming your "{prompt}" drawing into beautiful artwork
        </p>
        
        {/* Loading animation */}
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{ y: [0, -20, 0] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>
        
        <div className="text-sm text-purple-500">
          ✨ Powered by Nano Banana AI & ElevenLabs Audio
        </div>
      </motion.div>
    );
  }

  if (!showArtwork || !generatedArtwork) {
    return null;
  }

  return (
    <motion.div 
      className={`bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-6">
        <motion.div
          className="text-4xl mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: 3 }}
        >
          🎉
        </motion.div>
        <h3 className="text-2xl font-bold text-emerald-800 mb-1">
          Your Creative Masterpiece!
        </h3>
        <p className="text-emerald-600">
          Human creativity verified through your unique "{prompt}" drawing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Original Drawing */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3 text-center">
            Your Original Drawing
          </h4>
          <div className="flex justify-center">
            <img 
              src={originalDrawing}
              alt="Original drawing"
              className="max-w-full h-auto border border-gray-200 rounded-lg"
              style={{ maxHeight: '200px' }}
            />
          </div>
        </div>

        {/* AI Generated Artwork */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3 text-center">
            AI Enhanced Version
          </h4>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img 
              src={generatedArtwork.imageUrl}
              alt="AI generated artwork"
              className="max-w-full h-auto border border-gray-200 rounded-lg shadow-lg"
              style={{ maxHeight: '200px' }}
            />
          </motion.div>
        </div>
      </div>

      {/* AI Enhancement Info */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎨</span>
              <span className="font-semibold text-gray-700">Nano Banana AI</span>
            </div>
            <p className="text-sm text-gray-600">
              Enhanced your drawing with professional artistic styling and vibrant colors
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎵</span>
              <span className="font-semibold text-gray-700">ElevenLabs Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={playBackgroundMusic}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  audioPlaying 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {audioPlaying ? '🔊 Playing...' : '▶️ Play Theme Music'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Human Verification Badge */}
      <motion.div 
        className="bg-emerald-500 text-white rounded-full px-6 py-3 text-center font-bold text-lg mx-auto max-w-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 500 }}
      >
        ✅ Human Creativity Verified!
        <div className="text-sm opacity-90 mt-1">
          Your unique artistic expression confirms human intelligence
        </div>
      </motion.div>
    </motion.div>
  );
}