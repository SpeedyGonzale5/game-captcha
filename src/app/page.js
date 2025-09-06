'use client';

import { useState } from 'react';
import DrawingGame from '@/components/games/DrawingGame';

export default function Home() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleVerified = (result) => {
    setVerificationResult(result);
    setShowSuccess(true);
    
    // Simulate redirect or next step after 3 seconds
    setTimeout(() => {
      console.log('User verified:', result);
    }, 3000);
  };

  const handleGameComplete = (analytics) => {
    console.log('Game completed with analytics:', analytics);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-game-gradient flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-game p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            HUMAN VERIFIED!
          </h1>
          <p className="text-gray-600 mb-4">
            Your creativity proves you&apos;re not a bot. Enjoy your artwork!
          </p>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-800 font-semibold">
              🧠 Human Score: {verificationResult?.score}%
            </p>
          </div>
          <button 
            onClick={() => {setShowSuccess(false); setVerificationResult(null);}}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-pink bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <DrawingGame 
        onVerified={handleVerified}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}
