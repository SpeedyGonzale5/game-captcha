import { GAME_CONFIG } from './types.js';

// Collision Detection
export function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// Distance calculation
export function calculateDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Generate random position within bounds
export function getRandomPosition(maxX, maxY, objectWidth = 0, objectHeight = 0) {
  return {
    x: Math.random() * (maxX - objectWidth),
    y: Math.random() * (maxY - objectHeight)
  };
}

// Create bullet trajectory
export function createBullet(startX, startY, targetX, targetY, speed = GAME_CONFIG.BULLET_SPEED) {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return {
    x: startX,
    y: startY,
    targetX,
    targetY,
    velocityX: (dx / distance) * speed,
    velocityY: (dy / distance) * speed,
    speed,
    width: GAME_CONFIG.BULLET_SIZE.width,
    height: GAME_CONFIG.BULLET_SIZE.height
  };
}

// Update bullet position
export function updateBulletPosition(bullet) {
  return {
    ...bullet,
    x: bullet.x + bullet.velocityX,
    y: bullet.y + bullet.velocityY
  };
}

// Check if bullet is out of bounds
export function isBulletOutOfBounds(bullet, canvasWidth, canvasHeight) {
  return bullet.x < 0 || 
         bullet.x > canvasWidth || 
         bullet.y < 0 || 
         bullet.y > canvasHeight;
}

// Create enemy at random position
export function createEnemy(canvasWidth, canvasHeight) {
  const position = getRandomPosition(
    canvasWidth, 
    canvasHeight * 0.6, // Only spawn in top 60% of canvas
    GAME_CONFIG.ENEMY_SIZE, 
    GAME_CONFIG.ENEMY_SIZE
  );
  
  return {
    x: position.x,
    y: position.y + 20, // Offset from very top
    width: GAME_CONFIG.ENEMY_SIZE,
    height: GAME_CONFIG.ENEMY_SIZE,
    health: 1,
    id: Date.now() + Math.random() // Unique ID
  };
}

// Game state reducer
export function gameReducer(state, action) {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        gameActive: true,
        gameWon: false,
        score: 0,
        startTime: Date.now(),
        enemies: [],
        bullets: [],
        analytics: {
          shots: 0,
          hits: 0,
          mouseMoves: [],
          clickTimes: [],
          reactionTimes: []
        }
      };
      
    case 'START_GAME':
      return {
        ...state,
        gameActive: true,
        startTime: Date.now()
      };
      
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: state.score + (action.points || 1)
      };
      
    case 'ADD_ENEMY':
      return {
        ...state,
        enemies: [...state.enemies, action.enemy]
      };
      
    case 'REMOVE_ENEMY':
      return {
        ...state,
        enemies: state.enemies.filter(enemy => enemy.id !== action.enemyId)
      };
      
    case 'ADD_BULLET':
      return {
        ...state,
        bullets: [...state.bullets, action.bullet],
        analytics: {
          ...state.analytics,
          shots: state.analytics.shots + 1,
          clickTimes: [...state.analytics.clickTimes, Date.now() - state.startTime]
        }
      };
      
    case 'REMOVE_BULLET':
      return {
        ...state,
        bullets: state.bullets.filter(bullet => bullet.id !== action.bulletId)
      };
      
    case 'UPDATE_BULLETS':
      return {
        ...state,
        bullets: action.bullets
      };
      
    case 'GAME_WON':
      return {
        ...state,
        gameActive: false,
        gameWon: true,
        endTime: Date.now()
      };
      
    case 'RESET_GAME':
      return {
        gameActive: false,
        gameWon: false,
        score: 0,
        enemies: [],
        bullets: [],
        startTime: null,
        endTime: null,
        analytics: {
          shots: 0,
          hits: 0,
          mouseMoves: [],
          clickTimes: [],
          reactionTimes: []
        }
      };
      
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.data
        }
      };
      
    default:
      return state;
  }
}

// Initial game state
export const initialGameState = {
  gameActive: false,
  gameWon: false,
  score: 0,
  enemies: [],
  bullets: [],
  startTime: null,
  endTime: null,
  analytics: {
    shots: 0,
    hits: 0,
    mouseMoves: [],
    clickTimes: [],
    reactionTimes: []
  }
};

// Game loop utilities
export function shouldSpawnEnemy(enemies, maxEnemies, spawnRate) {
  return enemies.length < maxEnemies && Math.random() < spawnRate;
}

export function processCollisions(bullets, enemies) {
  const hitResults = [];
  const remainingBullets = [];
  const remainingEnemies = [...enemies];
  
  bullets.forEach(bullet => {
    let bulletHit = false;
    
    for (let i = 0; i < remainingEnemies.length; i++) {
      const enemy = remainingEnemies[i];
      
      if (checkCollision(bullet, enemy)) {
        hitResults.push({
          bulletId: bullet.id,
          enemyId: enemy.id,
          position: { x: enemy.x, y: enemy.y }
        });
        
        remainingEnemies.splice(i, 1);
        bulletHit = true;
        break;
      }
    }
    
    if (!bulletHit) {
      remainingBullets.push(bullet);
    }
  });
  
  return {
    hits: hitResults,
    bullets: remainingBullets,
    enemies: remainingEnemies
  };
}