'use client';

import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';

const DrawingCanvas = forwardRef(({
  width = 400,
  height = 300,
  onDrawingStart,
  onDrawingUpdate,
  onDrawingComplete,
  brushSize = 3,
  brushColor = '#000000',
  className = ""
}, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
  }, [brushColor, brushSize]);

  // Get coordinates from event
  const getCoordinates = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: Date.now()
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((event) => {
    const coordinates = getCoordinates(event);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    setIsDrawing(true);
    setHasDrawn(true);
    
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y);
    
    // Start new stroke
    const newStroke = {
      id: Date.now(),
      points: [coordinates],
      brushSize,
      brushColor,
      startTime: coordinates.timestamp
    };
    
    setStrokes(prev => [...prev, newStroke]);
    
    if (onDrawingStart) {
      onDrawingStart(coordinates);
    }
  }, [getCoordinates, brushSize, brushColor, onDrawingStart]);

  // Continue drawing
  const draw = useCallback((event) => {
    if (!isDrawing) return;
    
    const coordinates = getCoordinates(event);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(coordinates.x, coordinates.y);
    ctx.stroke();
    
    // Update current stroke
    setStrokes(prev => {
      const updated = [...prev];
      const currentStroke = updated[updated.length - 1];
      if (currentStroke) {
        currentStroke.points.push(coordinates);
      }
      return updated;
    });
    
    if (onDrawingUpdate) {
      onDrawingUpdate(coordinates);
    }
  }, [isDrawing, getCoordinates, onDrawingUpdate]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Complete current stroke
    setStrokes(prev => {
      const updated = [...prev];
      const currentStroke = updated[updated.length - 1];
      if (currentStroke) {
        currentStroke.endTime = Date.now();
      }
      return updated;
    });
    
    if (onDrawingComplete) {
      onDrawingComplete(strokes);
    }
  }, [isDrawing, strokes, onDrawingComplete]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    draw(e);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    draw(e);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // Clear canvas
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset canvas style properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    
    setStrokes([]);
    setHasDrawn(false);
    
    // Notify parent that drawing is cleared
    if (onDrawingComplete) {
      onDrawingComplete([]);
    }
  }, [brushColor, brushSize, onDrawingComplete]);

  // Undo last stroke
  const undo = useCallback(() => {
    if (strokes.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Remove last stroke
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    
    // Clear and redraw all remaining strokes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset canvas style properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    newStrokes.forEach(stroke => {
      ctx.strokeStyle = stroke.brushColor || '#000000';
      ctx.lineWidth = stroke.brushSize || 3;
      ctx.beginPath();
      
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
    });
    
    if (newStrokes.length === 0) {
      setHasDrawn(false);
    }
    
    // Notify parent of the updated strokes
    if (onDrawingComplete) {
      onDrawingComplete(newStrokes);
    }
  }, [strokes, onDrawingComplete]);

  // Export drawing as image data
  const exportDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    return {
      imageData: canvas.toDataURL(),
      strokes: strokes,
      dimensions: { width, height },
      metadata: {
        strokeCount: strokes.length,
        totalPoints: strokes.reduce((sum, stroke) => sum + stroke.points.length, 0),
        hasDrawing: hasDrawn
      }
    };
  }, [strokes, width, height, hasDrawn]);

  // Expose methods to parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    clear,
    undo,
    exportDrawing
  }), [clear, undo, exportDrawing]);

  return (
    <motion.div
      className={`drawing-canvas-container ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-white shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      />
      
      {!hasDrawn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">✏️</div>
            <div className="text-sm">Start drawing here</div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;