// Game Types and Interfaces

/**
 * @typedef {Object} Player
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate  
 * @property {number} width - Player width
 * @property {number} height - Player height
 * @property {HTMLElement} element - DOM element reference
 */

/**
 * @typedef {Object} Enemy
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} width - Enemy width
 * @property {number} height - Enemy height
 * @property {number} health - Enemy health points
 * @property {HTMLElement} element - DOM element reference
 */

/**
 * @typedef {Object} Bullet
 * @property {number} x - Current X coordinate
 * @property {number} y - Current Y coordinate
 * @property {number} targetX - Target X coordinate
 * @property {number} targetY - Target Y coordinate
 * @property {number} speed - Bullet speed
 * @property {HTMLElement} element - DOM element reference
 */

/**
 * @typedef {Object} GameState
 * @property {number} score - Current score
 * @property {boolean} gameActive - Whether game is currently active
 * @property {boolean} gameWon - Whether game has been won
 * @property {Player} player - Player object
 * @property {Enemy[]} enemies - Array of enemy objects
 * @property {Bullet[]} bullets - Array of bullet objects
 * @property {number} startTime - Game start timestamp
 * @property {Object} analytics - Analytics data
 */

/**
 * @typedef {Object} GameConfig
 * @property {number} targetScore - Score needed to win
 * @property {number} maxEnemies - Maximum enemies on screen
 * @property {number} bulletSpeed - Speed of bullets
 * @property {number} spawnRate - Enemy spawn probability
 * @property {number} canvasWidth - Game canvas width
 * @property {number} canvasHeight - Game canvas height
 */

/**
 * @typedef {Object} SecurityMetrics
 * @property {number[]} reactionTimes - Array of reaction times
 * @property {Object[]} mouseMoves - Mouse movement data
 * @property {Object[]} clickPatterns - Click pattern data
 * @property {number} accuracy - Shooting accuracy percentage
 * @property {number} humanScore - Calculated human likelihood score
 */

/**
 * @typedef {Object} VerificationResult
 * @property {boolean} isHuman - Whether user is verified as human
 * @property {number} score - Human confidence score (0-100)
 * @property {SecurityMetrics} metrics - Security analysis data
 * @property {string} sessionId - Unique session identifier
 */

// Game Action Types
export const GAME_ACTIONS = {
  INIT_GAME: 'INIT_GAME',
  START_GAME: 'START_GAME',
  UPDATE_SCORE: 'UPDATE_SCORE',
  ADD_ENEMY: 'ADD_ENEMY',
  REMOVE_ENEMY: 'REMOVE_ENEMY',
  ADD_BULLET: 'ADD_BULLET',
  REMOVE_BULLET: 'REMOVE_BULLET',
  UPDATE_POSITIONS: 'UPDATE_POSITIONS',
  GAME_WON: 'GAME_WON',
  RESET_GAME: 'RESET_GAME',
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS'
};

// Game Constants
export const GAME_CONFIG = {
  TARGET_SCORE: 3,
  MAX_ENEMIES: 3,
  BULLET_SPEED: 8,
  SPAWN_RATE: 0.01,
  CANVAS_WIDTH: 350,
  CANVAS_HEIGHT: 200,
  PLAYER_SIZE: 30,
  ENEMY_SIZE: 25,
  BULLET_SIZE: { width: 4, height: 8 }
};

// Security Analysis Thresholds
export const SECURITY_CONFIG = {
  MIN_REACTION_TIME: 100, // ms
  MAX_REACTION_TIME: 2000, // ms
  MIN_ACCURACY: 0.3, // 30%
  HUMAN_SCORE_THRESHOLD: 70, // Minimum score to pass
  MAX_MOUSE_SPEED: 1000, // pixels per second
  MIN_MOUSE_VARIANCE: 5 // minimum variance in mouse movement
};

const gameTypes = {
  GAME_ACTIONS,
  GAME_CONFIG, 
  SECURITY_CONFIG
};

export default gameTypes;