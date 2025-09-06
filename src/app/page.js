'use client';

import { useState } from 'react';
import DrawingGame from '@/components/games/DrawingGame';
import LoginCardSection from '@/components/ui/login-signup';

export default function Home() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
            onClick={() => {setShowSuccess(false); setVerificationResult(null); setIsLoggedIn(false);}}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show drawing CAPTCHA directly
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dark theme background with subtle patterns */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.03),transparent_60%)]" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      <DrawingGame 
        onVerified={handleVerified}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}
