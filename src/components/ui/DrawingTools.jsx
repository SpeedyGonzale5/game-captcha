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
      className={`flex flex-wrap items-center justify-center gap-4 p-4 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-glass ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white/90">Size:</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">1</span>
          <input
            type="range"
            min="1"
            max="12"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
            className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #667eea 0%, #764ba2 ${((brushSize - 1) / 11) * 100}%, rgba(255,255,255,0.2) ${((brushSize - 1) / 11) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <span className="text-xs text-white/70">12</span>
        </div>
        <div 
          className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/20 shadow-button-3d"
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
        <span className="text-sm font-medium text-white/90">Color:</span>
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onBrushColorChange(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                brushColor === color ? 'border-gray-600 scale-110' : 'border-gray-300'
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
          className={`px-4 py-2 rounded-button font-medium text-sm transition-all duration-200 border border-white/20 ${
            canUndo
              ? 'backdrop-blur-md bg-gradient-to-br from-yellow-500/80 to-orange-500/80 hover:from-yellow-400/90 hover:to-orange-400/90 text-white shadow-button-3d hover:shadow-glass-hover'
              : 'backdrop-blur-md bg-white/10 text-white/40 cursor-not-allowed'
          }`}
          whileHover={canUndo ? { scale: 1.05, y: -2 } : {}}
          whileTap={canUndo ? { scale: 0.95, y: 0 } : {}}
        >
          ↶ Undo
        </motion.button>

        <motion.button
          onClick={onClear}
          disabled={!canClear}
          className={`px-4 py-2 rounded-button font-medium text-sm transition-all duration-200 border border-white/20 ${
            canClear
              ? 'backdrop-blur-md bg-gradient-to-br from-red-500/80 to-pink-500/80 hover:from-red-400/90 hover:to-pink-400/90 text-white shadow-button-3d hover:shadow-glass-hover'
              : 'backdrop-blur-md bg-white/10 text-white/40 cursor-not-allowed'
          }`}
          whileHover={canClear ? { scale: 1.05, y: -2 } : {}}
          whileTap={canClear ? { scale: 0.95, y: 0 } : {}}
        >
          🗑️ Clear
        </motion.button>
      </div>
    </motion.div>
  );
}