'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#808080', '#FFFFFF'
];

export default function DrawingTools({
  onClear,
  onUndo,
  brushSize,
  onBrushSizeChange,
  brushColor,
  onBrushColorChange,
  canUndo,
  canClear,
  className = ""
}) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const paletteRef = useRef(null);

  // Close palette if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) {
        setIsPaletteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [paletteRef]);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 p-2 bg-white/80 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Brush Size Slider */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Size:</span>
        <input
          type="range"
          min="1"
          max="12"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200"></div>

      {/* Color Picker Popover */}
      <div className="relative" ref={paletteRef}>
        <span className="text-sm font-medium text-gray-700 mr-2">Color:</span>
        <motion.button
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
          style={{ backgroundColor: brushColor }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <AnimatePresence>
          {isPaletteOpen && (
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-2 bg-white rounded-full shadow-lg border border-gray-200 flex gap-1.5"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {colors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => {
                    onBrushColorChange(color);
                    setIsPaletteOpen(false);
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${brushColor === color ? 'border-blue-500 scale-110 shadow-inner' : 'border-white/50 hover:border-gray-300'}`}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200"></div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={onClear}
          disabled={!canClear}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>
    </div>
  );
}