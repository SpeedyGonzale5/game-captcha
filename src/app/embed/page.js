'use client';

import { useState, useEffect } from 'react';
import ShooterGame from '@/components/games/ShooterGame';

export default function EmbedPage() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [config, setConfig] = useState({
    theme: 'default',
    onSuccess: 'message',
    redirectUrl: null
  });

  // Parse URL parameters for configuration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setConfig({
        theme: urlParams.get('theme') || 'default',
        onSuccess: urlParams.get('onSuccess') || 'message',
        redirectUrl: urlParams.get('redirectUrl'),
        parentOrigin: urlParams.get('origin')
      });
    }
  }, []);

  const handleVerified = (result) => {
    setVerificationResult(result);

    // Send message to parent window if embedded
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({
        type: 'gameCaptchaVerified',
        result: result
      }, config.parentOrigin || '*');
    }

    // Handle redirect if specified
    if (config.onSuccess === 'redirect' && config.redirectUrl) {
      setTimeout(() => {
        window.location.href = config.redirectUrl;
      }, 2000);
    }
  };

  const handleGameComplete = (analytics) => {
    // Send analytics to parent window if embedded
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({
        type: 'gameCaptchaAnalytics',
        analytics: analytics
      }, config.parentOrigin || '*');
    }
  };

  if (verificationResult && config.onSuccess === 'message') {
    return (
      <div className="min-h-screen bg-game-gradient flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-game p-6 max-w-sm w-full text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-xl font-bold text-green-600 mb-2">
            Verification Complete!
          </h1>
          <p className="text-gray-600 text-sm mb-3">
            You have been verified as human.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-semibold text-sm">
              Human Score: {verificationResult.score}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-gradient flex items-center justify-center p-4">
      <ShooterGame 
        onVerified={handleVerified}
        onGameComplete={handleGameComplete}
        className="transform scale-90"
      />
    </div>
  );
}

// Note: This is an embed page - should not be indexed by search engines