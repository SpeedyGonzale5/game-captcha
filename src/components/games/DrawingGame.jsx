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
  const [editablePrompt, setEditablePrompt] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#000000');
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    imageGenerated: false,
    audioGenerated: false,
  });
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
    setEditablePrompt(newPrompt);
    setDrawingAnalytics(prev => ({
      ...prev,
      startTime: Date.now(),
      prompt: newPrompt,
      sessionId: sessionId.current
    }));
  }, []);

  // Handle prompt editing
  const handlePromptClick = () => {
    if (gameState === 'prompt' || gameState === 'drawing') {
      setIsEditingPrompt(true);
    }
  };

  const handlePromptChange = (e) => {
    setEditablePrompt(e.target.value);
  };

  const handlePromptSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const trimmedPrompt = editablePrompt.trim();
      if (trimmedPrompt) {
        // Ensure it starts with "Draw a" if it doesn't already
        const formattedPrompt = trimmedPrompt.toLowerCase().startsWith('draw a') 
          ? trimmedPrompt 
          : `Draw a ${trimmedPrompt}`;
        
        setPrompt(formattedPrompt);
        setEditablePrompt(formattedPrompt);
        setDrawingAnalytics(prev => ({
          ...prev,
          prompt: formattedPrompt,
          interactions: [...prev.interactions, {
            type: 'editPrompt',
            timestamp: Date.now(),
            value: formattedPrompt
          }]
        }));
      } else {
        // Reset to current prompt if empty
        setEditablePrompt(prompt);
      }
      setIsEditingPrompt(false);
    }
  };

  const handlePromptBlur = (e) => {
    handlePromptSubmit(e);
  };

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

  const handleSubmitDrawing = async () => {
    if (!canvasRef.current || isProcessing) return;

    // 1. Enter processing state and show modal immediately with loading skeletons
    setIsProcessing(true);
    setGameState('generated'); // Show modal immediately
    setLoadingStates({ imageGenerated: false, audioGenerated: false });
    setAiResult({ artwork: null, audio: null }); // Initialize with null values
    const drawingData = canvasRef.current.exportDrawing();

    try {
      // 2. Call the new backend API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: drawingData.imageData,
          prompt: prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();

      // 3. Update state with the real AI-generated content URLs
      // The modal will show even if audio generation failed
      setAiResult(result);
      setLoadingStates({
        imageGenerated: result.imageGenerated || false,
        audioGenerated: result.audioGenerated || false,
      });
      setGameState('generated');

    } catch (error) {
      console.error("Failed to generate AI artwork:", error);
      alert("Sorry, there was an issue creating the AI masterpiece. Please try again.");
      // Reset state on failure
      setGameState('drawing');
    } finally {
      setIsProcessing(false);
    }
  };

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
    setEditablePrompt(newPrompt);
    setIsEditingPrompt(false);
    setGameState('prompt');
    setHasDrawing(false);
    setIsProcessing(false);
    setAiResult(null);
    setLoadingStates({ imageGenerated: false, audioGenerated: false });
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
        <div className="relative flex items-center justify-center gap-3 mb-4 z-10">
          <h1 className="text-5xl font-black text-black tracking-tight leading-tight">
            Drawing Captcha
          </h1>
        </div>

        <div className="flex justify-center mb-6 z-10">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50/90 rounded-full border-2 border-blue-200/70 backdrop-blur-sm shadow-lg cursor-text hover:bg-blue-100/90 transition-colors">
            {isEditingPrompt ? (
              <input
                type="text"
                value={editablePrompt}
                onChange={handlePromptChange}
                onKeyDown={handlePromptSubmit}
                onBlur={handlePromptBlur}
                className="text-blue-800 text-lg font-semibold tracking-wide bg-transparent border-none outline-none min-w-[200px] text-center placeholder-blue-400"
                placeholder="Draw a..."
                autoFocus
                disabled={gameState === 'processing' || gameState === 'generated' || gameState === 'completed'}
              />
            ) : (
              <span 
                className="text-blue-800 text-lg font-semibold tracking-wide cursor-text select-none"
                onClick={handlePromptClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handlePromptClick();
                  }
                }}
              >
                {prompt}
              </span>
            )}
          </div>
        </div>

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
              <span className="relative text-white font-bold tracking-wide">COMPLETE YOUR DRAWING</span>
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
                audioUrl={aiResult.audio}
                prompt={prompt}
                isGenerating={isProcessing}
                imageGenerated={loadingStates.imageGenerated}
                audioGenerated={loadingStates.audioGenerated}
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