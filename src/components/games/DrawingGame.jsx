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
import { cn } from '@/lib/utils';
import { ShineBorder } from "@/components/magicui/shine-border";
import { Component as Loader1 } from "@/components/loader-1";

export default function DrawingGame({
  onVerified,
  onGameComplete,
  className = ""
}) {
  const [gameState, setGameState] = useState('prompt'); // prompt, drawing, processing, generated, completed
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
    
    // Update analytics and check if we still have strokes
    setDrawingAnalytics(prev => {
      const updatedStrokes = prev.strokes.slice(0, -1);
      // Update hasDrawing based on remaining strokes
      setHasDrawing(updatedStrokes.length > 0);
      
      return {
        ...prev,
        strokes: updatedStrokes,
        interactions: [...prev.interactions, {
          type: 'undo',
          timestamp: Date.now()
        }]
      };
    });
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

      setGameState('generated');
      setIsProcessing(false);

    } catch (error) {
      console.error('Drawing processing error:', error);
      alert('Something went wrong processing your drawing. Please try again.');
      setIsProcessing(false);
      setGameState('drawing');
    }
  }, [hasDrawing, prompt, drawingAnalytics, onGameComplete, onVerified]);

  // Handle continue to verification
  const handleContinueToVerification = useCallback(() => {
    if (!aiResult) return;

    setGameState('completed');

    // Calculate security analysis
    const drawingData = canvasRef.current?.exportDrawing();
    const securityAnalysis = calculateDrawingHumanScore(
      drawingData, 
      prompt, 
      drawingAnalytics
    );

    // Trigger verification
    if (onVerified) {
      onVerified({
        isHuman: securityAnalysis.isHuman,
        score: securityAnalysis.totalScore,
        sessionId: sessionId.current,
        type: 'drawing',
        prompt: prompt,
        artwork: aiResult.artwork,
        analytics: drawingAnalytics
      });
    }
  }, [aiResult, prompt, drawingAnalytics, onVerified]);

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
    <div className={`w-full max-w-4xl mx-auto relative ${className}`}>
      <ShineBorder
        className="absolute inset-0 rounded-3xl z-0"
        shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        borderWidth={2}
        duration={14}
      />
      <motion.div
        className="relative z-10 w-full h-full p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Subtle decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gray-200/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-300/50 rounded-full blur-3xl"></div>
        
        {/* Logo */}
        <div className="relative flex items-center justify-center gap-3 mb-2 z-10">
          <h1 className="text-3xl font-extrabold text-black">
            Drawing Captcha
          </h1>
        </div>

        <p className="text-black text-lg font-bold mb-4 text-center relative z-10">
          {prompt}
        </p>

        {/* Drawing Challenge Section */}
        <div className="relative bg-white/80 rounded-2xl p-4 mb-4 border border-gray-200 z-10 shadow-lg w-full flex-grow flex flex-col">
          <AnimatePresence>
            {gameState === 'processing' && (
              <motion.div
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-black font-semibold">AI is creating...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drawing Area */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-grow flex items-center justify-center">
            <DrawingCanvas
              ref={canvasRef}
              width={720}
              height={480}
              brushSize={brushSize}
              brushColor={brushColor}
              onDrawingStart={handleDrawingStart}
              onDrawingUpdate={handleDrawingUpdate}
              onDrawingComplete={handleDrawingComplete}
              className="mx-auto relative rounded-lg"
              placeholderComponent={gameState === 'prompt' ? <Loader1 /> : null}
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
            canUndo={drawingAnalytics.strokes.length > 0}
            canClear={drawingAnalytics.strokes.length > 0}
            className="pt-4"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <div className="bg-black rounded-lg">
            <VerifyButton
              score={hasDrawing ? 1 : 0}
              targetScore={1}
              onClick={handleSubmitDrawing}
              isVerifying={isProcessing}
              disabled={!hasDrawing || isProcessing || gameState === 'generated' || gameState === 'completed'}
              className={cn(
                "w-full py-3 px-6 bg-black text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-black/90",
                (gameState === 'generated' || gameState === 'completed') ? 'hidden' : '',
                (!hasDrawing || isProcessing) && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="relative">SUBMIT DRAWING</span>
            </VerifyButton>
          </div>
        </div>

        {/* Creative Encouragement */}
        {gameState === 'drawing' && (
          <motion.div
            className="relative mt-4 text-center p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-gray-500 text-xs">
              Use your mouse or finger to draw • Express your creativity
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* --- MASTERPIECE MODAL --- */}
      <AnimatePresence>
        {(gameState === 'generated' || gameState === 'completed') && aiResult && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl relative p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.button
                onClick={handleReset}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 bg-gray-100 rounded-full"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
              
              <AIArtworkDisplay
                originalDrawing={canvasRef.current?.exportDrawing().imageData}
                generatedArtwork={aiResult.artwork}
                prompt={prompt}
              />

              <div className="mt-6 px-2">
                {gameState === 'generated' && (
                  <motion.button
                    onClick={handleContinueToVerification}
                    className="w-full py-3 px-6 bg-black text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-black/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Verification
                  </motion.button>
                )}

                {gameState === 'completed' && (
                  <motion.button
                    onClick={handleReset}
                    className="w-full py-3 px-6 bg-black text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-black/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Another Masterpiece
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}