import { SECURITY_CONFIG } from './types.js';

// Mouse movement analysis
export function analyzeMouseMovement(mouseMoves) {
  if (mouseMoves.length < 5) {
    return { score: 50, reason: 'Insufficient mouse data' };
  }
  
  // Calculate smoothness (humans have natural micro-variations)
  let totalVariance = 0;
  let totalSpeed = 0;
  let speedChanges = 0;
  
  for (let i = 1; i < mouseMoves.length; i++) {
    const prev = mouseMoves[i - 1];
    const curr = mouseMoves[i];
    
    const timeDiff = curr.timestamp - prev.timestamp;
    const distance = Math.sqrt(
      Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
    );
    
    const speed = timeDiff > 0 ? distance / timeDiff : 0;
    totalSpeed += speed;
    
    if (i > 1) {
      const prevSpeed = mouseMoves[i - 2].speed || 0;
      speedChanges += Math.abs(speed - prevSpeed);
    }
    
    curr.speed = speed;
  }
  
  const avgSpeed = totalSpeed / (mouseMoves.length - 1);
  const speedVariance = speedChanges / (mouseMoves.length - 2);
  
  // Humans have irregular movement patterns
  let score = 50;
  
  // Check for too perfect/robotic movement
  if (speedVariance < SECURITY_CONFIG.MIN_MOUSE_VARIANCE) {
    score -= 20; // Too consistent = likely bot
  }
  
  // Check for impossible speeds
  if (avgSpeed > SECURITY_CONFIG.MAX_MOUSE_SPEED) {
    score -= 30; // Too fast = likely bot
  }
  
  // Check for natural variance (humans aren't perfect)
  if (speedVariance > SECURITY_CONFIG.MIN_MOUSE_VARIANCE * 2) {
    score += 20; // Good human variance
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    avgSpeed,
    speedVariance,
    dataPoints: mouseMoves.length
  };
}

// Reaction time analysis
export function analyzeReactionTimes(reactionTimes) {
  if (reactionTimes.length === 0) {
    return { score: 0, reason: 'No reaction time data' };
  }
  
  const avg = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
  const variance = reactionTimes.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / reactionTimes.length;
  const stdDev = Math.sqrt(variance);
  
  let score = 50;
  
  // Human reaction times typically 200-800ms with natural variance
  if (avg >= SECURITY_CONFIG.MIN_REACTION_TIME && avg <= SECURITY_CONFIG.MAX_REACTION_TIME) {
    score += 20;
  } else {
    score -= 30; // Too fast or too slow = suspicious
  }
  
  // Humans have natural variance in reaction time
  if (stdDev > 50) {
    score += 15; // Good human variance
  } else {
    score -= 15; // Too consistent = likely bot
  }
  
  // Check for impossible consistent timing
  const tooConsistent = reactionTimes.every(time => Math.abs(time - avg) < 10);
  if (tooConsistent && reactionTimes.length > 2) {
    score -= 40; // Extremely consistent = very likely bot
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    average: avg,
    variance: stdDev,
    samples: reactionTimes.length
  };
}

// Click pattern analysis
export function analyzeClickPatterns(clickTimes, mouseMoves) {
  if (clickTimes.length === 0) {
    return { score: 50, reason: 'No click data' };
  }
  
  let score = 50;
  
  // Analyze click timing intervals
  const intervals = [];
  for (let i = 1; i < clickTimes.length; i++) {
    intervals.push(clickTimes[i] - clickTimes[i - 1]);
  }
  
  if (intervals.length > 0) {
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const intervalVariance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    
    // Humans have natural variation in click timing
    if (intervalVariance > 10000) { // More than 100ms variance
      score += 15;
    } else {
      score -= 20; // Too consistent = suspicious
    }
    
    // Check for mechanical timing patterns
    const tooRegular = intervals.every(interval => Math.abs(interval - avgInterval) < 50);
    if (tooRegular && intervals.length > 2) {
      score -= 30;
    }
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    clickCount: clickTimes.length,
    intervals: intervals.length
  };
}

// Accuracy analysis
export function analyzeAccuracy(shots, hits) {
  if (shots === 0) {
    return { score: 50, reason: 'No shots fired' };
  }
  
  const accuracy = hits / shots;
  let score = 50;
  
  // Perfect accuracy is suspicious, humans miss sometimes
  if (accuracy === 1.0 && shots > 2) {
    score -= 25; // Perfect accuracy = suspicious
  } else if (accuracy >= SECURITY_CONFIG.MIN_ACCURACY && accuracy <= 0.8) {
    score += 20; // Good human accuracy range
  } else if (accuracy < SECURITY_CONFIG.MIN_ACCURACY) {
    score -= 15; // Too many misses = suspicious or poor player
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    accuracy: accuracy,
    shots: shots,
    hits: hits
  };
}

// Comprehensive security analysis
export function calculateHumanScore(analytics) {
  const mouseAnalysis = analyzeMouseMovement(analytics.mouseMoves || []);
  const reactionAnalysis = analyzeReactionTimes(analytics.reactionTimes || []);
  const clickAnalysis = analyzeClickPatterns(analytics.clickTimes || [], analytics.mouseMoves || []);
  const accuracyAnalysis = analyzeAccuracy(analytics.shots || 0, analytics.hits || 0);
  
  // Weighted average of all analysis scores
  const weights = {
    mouse: 0.3,
    reaction: 0.3,
    clicks: 0.2,
    accuracy: 0.2
  };
  
  const totalScore = 
    mouseAnalysis.score * weights.mouse +
    reactionAnalysis.score * weights.reaction +
    clickAnalysis.score * weights.clicks +
    accuracyAnalysis.score * weights.accuracy;
  
  const isHuman = totalScore >= SECURITY_CONFIG.HUMAN_SCORE_THRESHOLD;
  
  return {
    totalScore: Math.round(totalScore),
    isHuman,
    breakdown: {
      mouse: mouseAnalysis,
      reaction: reactionAnalysis,
      clicks: clickAnalysis,
      accuracy: accuracyAnalysis
    },
    confidence: getConfidenceLevel(totalScore),
    recommendation: getRecommendation(totalScore, isHuman)
  };
}

function getConfidenceLevel(score) {
  if (score >= 90) return 'Very High';
  if (score >= 80) return 'High';
  if (score >= 70) return 'Medium';
  if (score >= 50) return 'Low';
  return 'Very Low';
}

function getRecommendation(score, isHuman) {
  if (isHuman && score >= 85) {
    return 'Verified human with excellent interaction patterns';
  } else if (isHuman) {
    return 'Verified human with acceptable interaction patterns';
  } else if (score >= 60) {
    return 'Possible human but interaction patterns need verification';
  } else {
    return 'Likely automated behavior detected - verification failed';
  }
}

// Generate session ID
export function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Track mouse movement
export function trackMouseMove(x, y, timestamp = Date.now()) {
  return {
    x,
    y,
    timestamp
  };
}

// Calculate reaction time from stimulus to response
export function calculateReactionTime(stimulusTime, responseTime) {
  return responseTime - stimulusTime;
}