'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShooterGame from '@/components/games/ShooterGame';

export default function Demo() {
  const [activeDemo, setActiveDemo] = useState('shooter');
  const [verificationResults, setVerificationResults] = useState([]);

  const handleVerified = (result) => {
    setVerificationResults(prev => [...prev, result]);
    console.log('Verification result:', result);
  };

  const handleGameComplete = (analytics) => {
    console.log('Game analytics:', analytics);
  };

  const demos = [
    {
      id: 'shooter',
      name: '🎮 Shooter Game',
      description: 'Click to shoot enemies and prove your human reflexes',
      component: ShooterGame
    }
    // More games will be added here
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎮 GameCaptcha Demo
              </h1>
              <p className="text-gray-600 mt-1">
                Interactive CAPTCHA replacement using engaging mini-games
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Verifications: {verificationResults.length}
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                ← Back to Game
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Game Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Available Games
              </h2>
              <div className="space-y-3">
                {demos.map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      activeDemo === demo.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {demo.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {demo.description}
                    </div>
                  </button>
                ))}
                
                {/* Coming Soon Games */}
                <div className="p-4 rounded-lg border-2 border-gray-200 opacity-50">
                  <div className="font-semibold text-gray-500">
                    🚧 More Games Coming Soon
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Maze Runner, Pattern Match, and more...
                  </div>
                </div>
              </div>

              {/* Integration Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔧 Easy Integration
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>• React component</div>
                  <div>• RESTful API</div>
                  <div>• Embeddable widget</div>
                  <div>• Custom themes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Demo Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {demos.find(d => d.id === activeDemo)?.name || 'Game Demo'}
                </h2>
                <div className="text-sm text-gray-500">
                  Try the interactive demo below
                </div>
              </div>

              {/* Game Container */}
              <div className="flex justify-center bg-game-gradient p-8 rounded-xl">
                {activeDemo === 'shooter' && (
                  <ShooterGame
                    onVerified={handleVerified}
                    onGameComplete={handleGameComplete}
                  />
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  🎯 How it works:
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Move your mouse to aim</li>
                  <li>Click to shoot at the alien enemies (👾)</li>
                  <li>Destroy 3 enemies to complete the challenge</li>
                  <li>Your behavior is analyzed for human patterns</li>
                  <li>Get verified as human!</li>
                </ol>
              </div>
            </div>

            {/* Verification Results */}
            {verificationResults.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📊 Verification Results
                </h3>
                <div className="space-y-4">
                  {verificationResults.slice(-5).reverse().map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        result.isHuman 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-semibold ${
                            result.isHuman ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {result.isHuman ? '✅ Human Verified' : '❌ Verification Failed'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Score: {result.score}% | Session: {result.sessionId?.slice(-8)}
                          </div>
                        </div>
                        <div className={`text-2xl ${
                          result.isHuman ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {result.isHuman ? '🧠' : '🤖'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}