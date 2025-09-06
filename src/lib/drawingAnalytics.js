import { SECURITY_CONFIG } from './types.js';

// Analyze drawing stroke patterns for human-like behavior
export function analyzeDrawingStrokes(strokes) {
  if (!strokes || strokes.length === 0) {
    return { score: 0, reason: 'No drawing data' };
  }

  let score = 50;
  const metrics = {
    strokeCount: strokes.length,
    totalPoints: 0,
    averageStrokeLength: 0,
    strokeVariance: 0,
    speedVariance: 0,
    pressureVariance: 0
  };

  // Calculate basic metrics
  strokes.forEach(stroke => {
    metrics.totalPoints += stroke.points.length;
  });

  metrics.averageStrokeLength = metrics.totalPoints / metrics.strokeCount;

  // Analyze stroke lengths for natural variation
  const strokeLengths = strokes.map(stroke => stroke.points.length);
  const avgLength = strokeLengths.reduce((sum, len) => sum + len, 0) / strokeLengths.length;
  const variance = strokeLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / strokeLengths.length;
  metrics.strokeVariance = Math.sqrt(variance);

  // Human strokes have natural length variation
  if (metrics.strokeVariance > 3) {
    score += 15; // Good human variation
  } else if (metrics.strokeVariance < 1) {
    score -= 20; // Too consistent = suspicious
  }

  // Analyze drawing speed patterns
  const speeds = [];
  strokes.forEach(stroke => {
    for (let i = 1; i < stroke.points.length; i++) {
      const prev = stroke.points[i - 1];
      const curr = stroke.points[i];
      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      const timeDiff = curr.timestamp - prev.timestamp;
      if (timeDiff > 0) {
        speeds.push(distance / timeDiff);
      }
    }
  });

  if (speeds.length > 5) {
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const speedVariance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / speeds.length;
    metrics.speedVariance = Math.sqrt(speedVariance);

    // Humans have natural speed variation
    if (metrics.speedVariance > 0.1) {
      score += 20; // Good human speed variation
    } else if (metrics.speedVariance < 0.02) {
      score -= 25; // Too consistent speed = likely bot
    }
  }

  // Check for realistic stroke count (humans typically use 3-15 strokes for simple objects)
  if (metrics.strokeCount >= 3 && metrics.strokeCount <= 20) {
    score += 10;
  } else if (metrics.strokeCount > 50) {
    score -= 15; // Too many strokes might indicate automated behavior
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    metrics,
    details: {
      strokeAnalysis: metrics.strokeVariance > 3 ? 'Natural variation' : 'Low variation',
      speedAnalysis: metrics.speedVariance > 0.1 ? 'Human-like speed changes' : 'Consistent speed',
      strokeCount: `${metrics.strokeCount} strokes`,
    }
  };
}

// Analyze drawing timing patterns
export function analyzeDrawingTiming(strokes) {
  if (!strokes || strokes.length === 0) {
    return { score: 50, reason: 'No timing data' };
  }

  let score = 50;
  const pauseBetweenStrokes = [];
  
  // Calculate pauses between strokes
  for (let i = 1; i < strokes.length; i++) {
    const prevStroke = strokes[i - 1];
    const currentStroke = strokes[i];
    
    if (prevStroke.endTime && currentStroke.startTime) {
      const pause = currentStroke.startTime - prevStroke.endTime;
      pauseBetweenStrokes.push(pause);
    }
  }

  if (pauseBetweenStrokes.length > 0) {
    const avgPause = pauseBetweenStrokes.reduce((sum, pause) => sum + pause, 0) / pauseBetweenStrokes.length;
    const pauseVariance = pauseBetweenStrokes.reduce((sum, pause) => sum + Math.pow(pause - avgPause, 2), 0) / pauseBetweenStrokes.length;
    
    // Humans have natural variation in thinking/planning time
    if (pauseVariance > 10000) { // More than 100ms variance
      score += 20; // Good human variation
    } else if (pauseVariance < 1000) { // Less than 32ms variance
      score -= 20; // Too consistent = suspicious
    }

    // Check for realistic pause times (humans pause to think/plan)
    const avgPauseSeconds = avgPause / 1000;
    if (avgPauseSeconds >= 0.2 && avgPauseSeconds <= 3) {
      score += 15; // Realistic human thinking time
    } else if (avgPauseSeconds < 0.1) {
      score -= 15; // Too fast = suspicious
    }
  }

  // Analyze total drawing time
  const firstStroke = strokes[0];
  const lastStroke = strokes[strokes.length - 1];
  
  if (firstStroke.startTime && lastStroke.endTime) {
    const totalTime = lastStroke.endTime - firstStroke.startTime;
    const totalTimeSeconds = totalTime / 1000;
    
    // Realistic drawing time for simple objects (5-60 seconds)
    if (totalTimeSeconds >= 5 && totalTimeSeconds <= 60) {
      score += 15;
    } else if (totalTimeSeconds < 2) {
      score -= 25; // Too fast = likely automated
    } else if (totalTimeSeconds > 120) {
      score += 5; // Taking time is human-like (but might be overthinking)
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    timing: {
      totalStrokes: strokes.length,
      pauseCount: pauseBetweenStrokes.length,
      averagePause: pauseBetweenStrokes.length > 0 ? 
        pauseBetweenStrokes.reduce((sum, pause) => sum + pause, 0) / pauseBetweenStrokes.length : 0
    }
  };
}

// Analyze if drawing resembles the prompted object
export function analyzeDrawingContent(drawingData, prompt) {
  // Mock content analysis - in real implementation, would use AI image recognition
  let score = 50;
  const { strokes, dimensions } = drawingData;
  
  if (!strokes || strokes.length === 0) {
    return { score: 0, reason: 'No drawing content' };
  }

  // Basic heuristics for common objects
  const objectType = extractObjectFromPrompt(prompt);
  const analysis = analyzeShapeComplexity(strokes, dimensions);
  
  switch (objectType.toLowerCase()) {
    case 'fish':
      score = analyzeFishDrawing(analysis);
      break;
    case 'cat':
      score = analyzeCatDrawing(analysis);
      break;
    case 'house':
      score = analyzeHouseDrawing(analysis);
      break;
    case 'tree':
      score = analyzeTreeDrawing(analysis);
      break;
    case 'car':
      score = analyzeCarDrawing(analysis);
      break;
    default:
      // General object analysis
      score = analyzeGeneralObject(analysis);
  }

  // Bonus for reasonable drawing complexity
  if (analysis.boundingBoxRatio > 0.1 && analysis.boundingBoxRatio < 0.9) {
    score += 10; // Good use of canvas space
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    objectType,
    analysis: {
      complexity: analysis.complexity,
      coverage: analysis.boundingBoxRatio,
      strokeDensity: analysis.strokeDensity
    }
  };
}

// Helper functions
function extractObjectFromPrompt(prompt) {
  const words = prompt.toLowerCase().split(' ');
  const articles = ['a', 'an', 'the'];
  return words.find(word => !articles.includes(word)) || 'object';
}

function analyzeShapeComplexity(strokes, dimensions) {
  const allPoints = strokes.flatMap(stroke => stroke.points);
  
  if (allPoints.length === 0) {
    return { complexity: 0, boundingBoxRatio: 0, strokeDensity: 0 };
  }

  // Calculate bounding box
  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));
  
  const width = maxX - minX;
  const height = maxY - minY;
  const area = width * height;
  const canvasArea = dimensions.width * dimensions.height;
  
  return {
    complexity: strokes.length + (allPoints.length / 10), // Simple complexity metric
    boundingBoxRatio: area / canvasArea,
    strokeDensity: allPoints.length / area,
    dimensions: { width, height }
  };
}

// Object-specific analysis functions
function analyzeFishDrawing(analysis) {
  let score = 70; // Base score for attempting the object
  
  // Fish typically need body + tail (minimum 2 main shapes)
  if (analysis.complexity >= 5) score += 15;
  if (analysis.boundingBoxRatio > 0.15) score += 10; // Reasonable size
  if (analysis.dimensions.width > analysis.dimensions.height) score += 5; // Fish are typically wider
  
  return score;
}

function analyzeCatDrawing(analysis) {
  let score = 70;
  
  // Cat needs body, head, ears, tail (more complex)
  if (analysis.complexity >= 8) score += 15;
  if (analysis.boundingBoxRatio > 0.2) score += 10;
  
  return score;
}

function analyzeHouseDrawing(analysis) {
  let score = 70;
  
  // House typically has geometric shapes
  if (analysis.complexity >= 4 && analysis.complexity <= 12) score += 15;
  if (analysis.dimensions.height > analysis.dimensions.width * 0.6) score += 5; // Houses are often taller
  
  return score;
}

function analyzeTreeDrawing(analysis) {
  let score = 70;
  
  // Trees have trunk + foliage
  if (analysis.complexity >= 3) score += 15;
  if (analysis.dimensions.height > analysis.dimensions.width) score += 10; // Trees are taller
  
  return score;
}

function analyzeCarDrawing(analysis) {
  let score = 70;
  
  // Cars are typically wider and have multiple parts
  if (analysis.complexity >= 5) score += 15;
  if (analysis.dimensions.width > analysis.dimensions.height) score += 10; // Cars are wider
  
  return score;
}

function analyzeGeneralObject(analysis) {
  let score = 60;
  
  // General object should have reasonable complexity and size
  if (analysis.complexity >= 3) score += 20;
  if (analysis.boundingBoxRatio > 0.1) score += 15;
  
  return score;
}

// Comprehensive drawing security analysis
export function calculateDrawingHumanScore(drawingData, prompt, analytics) {
  const strokeAnalysis = analyzeDrawingStrokes(drawingData.strokes);
  const timingAnalysis = analyzeDrawingTiming(drawingData.strokes);
  const contentAnalysis = analyzeDrawingContent(drawingData, prompt);
  
  // Weighted average
  const weights = {
    strokes: 0.3,
    timing: 0.3,
    content: 0.4
  };
  
  const totalScore = 
    strokeAnalysis.score * weights.strokes +
    timingAnalysis.score * weights.timing +
    contentAnalysis.score * weights.content;
  
  const isHuman = totalScore >= SECURITY_CONFIG.HUMAN_SCORE_THRESHOLD;
  
  return {
    totalScore: Math.round(totalScore),
    isHuman,
    breakdown: {
      strokes: strokeAnalysis,
      timing: timingAnalysis,
      content: contentAnalysis
    },
    confidence: getDrawingConfidenceLevel(totalScore),
    recommendation: getDrawingRecommendation(totalScore, isHuman)
  };
}

function getDrawingConfidenceLevel(score) {
  if (score >= 90) return 'Very High';
  if (score >= 80) return 'High';
  if (score >= 70) return 'Medium';
  if (score >= 50) return 'Low';
  return 'Very Low';
}

function getDrawingRecommendation(score, isHuman) {
  if (isHuman && score >= 85) {
    return 'Excellent creative expression with natural human drawing patterns';
  } else if (isHuman) {
    return 'Verified human creativity with acceptable drawing behavior';
  } else if (score >= 60) {
    return 'Drawing patterns require additional verification';
  } else {
    return 'Automated or suspicious drawing behavior detected';
  }
}