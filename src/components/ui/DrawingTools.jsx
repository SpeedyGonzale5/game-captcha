'use client';

import { motion } from 'framer-motion';

export default function DrawingTools({
  onClear,
  onUndo,
  brushSize,
  onBrushSizeChange,
  brushColor,
  onBrushColorChange,
  canUndo = false,
  canClear = false,
  className = ""
}) {
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

  return (
    <motion.div 
      className={`flex flex-wrap items-center justify-center gap-4 p-4 bg-white/20 rounded-lg border border-white/30 shadow-glass ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-black">Size:</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">1</span>
          <input
            type="range"
            min="1"
            max="12"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
            className="w-20 h-2 bg-gray-300/50 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #6b7280 0%, #4b5563 ${((brushSize - 1) / 11) * 100}%, rgba(0,0,0,0.2) ${((brushSize - 1) / 11) * 100}%, rgba(0,0,0,0.2) 100%)`
            }}
          />
          <span className="text-xs text-gray-700">12</span>
        </div>
        <div 
          className="w-6 h-6 rounded-full border border-gray-400/50 flex items-center justify-center bg-white/40 shadow-button-3d"
          style={{ backgroundColor: brushColor }}
        >
          <div 
            className="rounded-full"
            style={{ 
              width: Math.max(2, brushSize * 2), 
              height: Math.max(2, brushSize * 2), 
              backgroundColor: brushColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
            }}
          />
        </div>
      </div>

      {/* Color Palette */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-black">Color:</span>
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onBrushColorChange(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                brushColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={`Select ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-4 py-2 rounded-button font-bold text-sm transition-all duration-200 border border-gray-300 ${
            canUndo
              ? 'bg-black text-white shadow-button-3d hover:shadow-xl active:shadow-md transform hover:-translate-y-1 active:translate-y-0.5'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={canUndo ? { scale: 1.05, y: -2 } : {}}
          whileTap={canUndo ? { scale: 0.95, y: 0 } : {}}
        >
          Undo
        </motion.button>

        <motion.button
          onClick={onClear}
          disabled={!canClear}
          className={`px-4 py-2 rounded-button font-bold text-sm transition-all duration-200 border border-gray-300 ${
            canClear
              ? 'bg-black text-white shadow-button-3d hover:shadow-xl active:shadow-md transform hover:-translate-y-1 active:translate-y-0.5'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={canClear ? { scale: 1.05, y: -2 } : {}}
          whileTap={canClear ? { scale: 0.95, y: 0 } : {}}
        >
          Clear
        </motion.button>
      </div>
    </motion.div>
  );
}