'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrawingCanvas from '@/components/ui/DrawingCanvas';
import DrawingTools from '@/components/ui/DrawingTools';
import AIArtworkDisplay from '@/components/ui/AIArtworkDisplay';
import VerifyButton from '@/components/ui/VerifyButton';
import { generateRandomPrompt, processDrawingWithAI, validateDrawingContent } from '@/lib/mockAI';
import { calculateDrawingHumanScore } from '@/lib/drawingAnalytics';
import { generateSessionId } from '@/lib/securityAnalytics';

export default function DrawingGame({
  onVerified,
  onGameComplete,
  className = ""
}) {
  const [gameState, setGameState] = useState('prompt'); // prompt, drawing, processing, completed
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#000000');
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [drawingAnalytics, setDrawingAnalytics] = useState({
    startTime: null,
    strokes: [],
    mouseMoves: [],
    interactions: []
  });
  
  const canvasRef = useRef(null);
  const sessionId = useRef(generateSessionId());

  // Initialize game with random prompt
  useEffect(() => {
    const newPrompt = generateRandomPrompt();
    setPrompt(newPrompt);
    setDrawingAnalytics(prev => ({
      ...prev,
      startTime: Date.now(),
      prompt: newPrompt,
      sessionId: sessionId.current
    }));
  }, []);

  // Handle drawing start
  const handleDrawingStart = useCallback((coordinates) => {
    if (drawingAnalytics.startTime === null) {
      setDrawingAnalytics(prev => ({
        ...prev,
        startTime: Date.now()
      }));
    }
    
    setGameState('drawing');
    setDrawingAnalytics(prev => ({
      ...prev,
      interactions: [...prev.interactions, {
        type: 'drawingStart',
        timestamp: coordinates.timestamp,
        coordinates
      }]
    }));
  }, [drawingAnalytics.startTime]);

  // Handle drawing updates
  const handleDrawingUpdate = useCallback((coordinates) => {
    setDrawingAnalytics(prev => ({
      ...prev,
      mouseMoves: [...prev.mouseMoves, coordinates]
    }));
  }, []);

  // Handle drawing completion
  const handleDrawingComplete = useCallback((strokes) => {
    setHasDrawing(strokes && strokes.length > 0);
    setDrawingAnalytics(prev => ({
      ...prev,
      strokes: strokes || [],
      endTime: Date.now()
    }));
  }, []);

  // Clear canvas
  const handleClear = useCallback(() => {
    if (canvasRef.current && canvasRef.current.clear) {
      canvasRef.current.clear();
    }
    setHasDrawing(false);
    setGameState('prompt');
    setDrawingAnalytics(prev => ({
      ...prev,
      strokes: [],
      mouseMoves: [],
      interactions: [...prev.interactions, {
        type: 'clear',
        timestamp: Date.now()
      }]
    }));
  }, []);

  // Undo last stroke
  const handleUndo = useCallback(() => {
    if (canvasRef.current && canvasRef.current.undo) {
      canvasRef.current.undo();
    }
    setDrawingAnalytics(prev => ({
      ...prev,
      interactions: [...prev.interactions, {
        type: 'undo',
        timestamp: Date.now()
      }]
    }));
  }, []);

  // Submit drawing for AI processing
  const handleSubmitDrawing = useCallback(async () => {
    if (!hasDrawing || !canvasRef.current) return;

    setIsProcessing(true);
    setGameState('processing');

    try {
      // Export drawing data
      const drawingData = canvasRef.current.exportDrawing();
      
      // Validate drawing content
      const validation = validateDrawingContent(drawingData, prompt);
      if (!validation.isValid) {
        alert(validation.reason + '. Please try drawing again.');
        setIsProcessing(false);
        setGameState('drawing');
        return;
      }

      // Process with AI
      const aiProcessingResult = await processDrawingWithAI(drawingData, prompt);
      
      if (!aiProcessingResult.success) {
        throw new Error('AI processing failed');
      }

      setAiResult(aiProcessingResult);
      
      // Calculate security analytics
      const securityAnalysis = calculateDrawingHumanScore(
        drawingData, 
        prompt, 
        drawingAnalytics
      );

      // Complete the game
      if (onGameComplete) {
        onGameComplete({
          ...drawingAnalytics,
          drawingData,
          validation,
          aiResult: aiProcessingResult,
          securityAnalysis
        });
      }

      setGameState('completed');
      setIsProcessing(false);

      // Trigger verification
      if (onVerified) {
        setTimeout(() => {
          onVerified({
            isHuman: securityAnalysis.isHuman,
            score: securityAnalysis.totalScore,
            sessionId: sessionId.current,
            type: 'drawing',
            prompt: prompt,
            artwork: aiProcessingResult.artwork,
            analytics: drawingAnalytics
          });
        }, 3000); // Show artwork for 3 seconds before verification
      }

    } catch (error) {
      console.error('Drawing processing error:', error);
      alert('Something went wrong processing your drawing. Please try again.');
      setIsProcessing(false);
      setGameState('drawing');
    }
  }, [hasDrawing, prompt, drawingAnalytics, onGameComplete, onVerified]);

  // Reset game
  const handleReset = useCallback(() => {
    const newPrompt = generateRandomPrompt();
    setPrompt(newPrompt);
    setGameState('prompt');
    setHasDrawing(false);
    setIsProcessing(false);
    setAiResult(null);
    sessionId.current = generateSessionId();
    setDrawingAnalytics({
      startTime: Date.now(),
      strokes: [],
      mouseMoves: [],
      interactions: [],
      prompt: newPrompt,
      sessionId: sessionId.current
    });
    
    if (canvasRef.current && canvasRef.current.clear) {
      canvasRef.current.clear();
    }
  }, []);

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <motion.div
        className="bg-white rounded-3xl shadow-game p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Security badge */}
        <div className="absolute top-5 right-5 bg-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          🎨 Creative Security
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
            🎨
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            Creative CAPTCHA
          </h1>
        </div>

        <p className="text-gray-600 text-lg font-semibold mb-8 text-center">
          Prove you&apos;re human by drawing!
        </p>

        {/* Drawing Challenge Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 mb-6 border-4 border-purple-300 shadow-inner">
          <div className="text-center mb-6">
            <motion.div
              className="text-2xl font-extrabold text-purple-700 mb-2 flex items-center justify-center gap-2"
              animate={gameState === 'prompt' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl">🎯</span>
              Creative Challenge
            </motion.div>
            <motion.div 
              className="text-xl text-purple-600 font-semibold"
              key={prompt} // Re-animate when prompt changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {prompt}
            </motion.div>
          </div>

          {/* Drawing Area */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <DrawingCanvas
              ref={canvasRef}
              width={500}
              height={350}
              brushSize={brushSize}
              brushColor={brushColor}
              onDrawingStart={handleDrawingStart}
              onDrawingUpdate={handleDrawingUpdate}
              onDrawingComplete={handleDrawingComplete}
              className="mx-auto relative"
            />
          </div>

          {/* Drawing Tools */}
          <DrawingTools
            onClear={handleClear}
            onUndo={handleUndo}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            brushColor={brushColor}
            onBrushColorChange={setBrushColor}
            canUndo={hasDrawing && drawingAnalytics.strokes.length > 0}
            canClear={hasDrawing}
          />

          {/* Instructions */}
          <motion.div 
            className="mt-4 text-center text-sm text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ✏️ Use your mouse or finger to draw • 🎨 Express your creativity • 🤖 AI will enhance your artwork
          </motion.div>
        </div>

        {/* AI Processing/Result Display */}
        <AnimatePresence>
          {gameState === 'processing' && (
            <AIArtworkDisplay
              isGenerating={true}
              prompt={prompt}
              className="mb-6"
            />
          )}
          
          {gameState === 'completed' && aiResult && (
            <AIArtworkDisplay
              originalDrawing={canvasRef.current?.exportDrawing().imageData}
              generatedArtwork={aiResult.artwork}
              prompt={prompt}
              className="mb-6"
            />
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="space-y-4">
          <VerifyButton
            score={hasDrawing ? 1 : 0}
            targetScore={1}
            onClick={handleSubmitDrawing}
            isVerifying={isProcessing}
            disabled={!hasDrawing || isProcessing || gameState === 'completed'}
            className={gameState === 'completed' ? 'hidden' : ''}
          />

          {gameState === 'completed' && (
            <motion.button
              onClick={handleReset}
              className="w-full py-4 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              🎨 Create Another Masterpiece
            </motion.button>
          )}
        </div>

        {/* Creative Encouragement */}
        {gameState === 'drawing' && (
          <motion.div
            className="mt-6 text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-purple-700 font-semibold text-sm">
              🌟 Let your creativity flow! There&apos;s no wrong way to draw.
            </div>
            <div className="text-purple-600 text-xs mt-1">
              Your unique artistic expression helps verify you&apos;re human
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}