'use client';

import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCanvas from '@/components/ui/GameCanvas';
import ScoreDisplay from '@/components/ui/ScoreDisplay';
import VerifyButton from '@/components/ui/VerifyButton';
import Player from '@/components/ui/Player';
import Enemy from '@/components/ui/Enemy';
import Bullet from '@/components/ui/Bullet';
import Explosion from '@/components/ui/Explosion';
import { 
  gameReducer, 
  initialGameState, 
  createBullet, 
  createEnemy,
  updateBulletPosition,
  processCollisions,
  shouldSpawnEnemy,
  isBulletOutOfBounds
} from '@/lib/gameEngine';
import { GAME_CONFIG } from '@/lib/types';
import { trackMouseMove, calculateReactionTime } from '@/lib/securityAnalytics';

export default function ShooterGame({ 
  onVerified,
  onGameComplete,
  className = ""
}) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [explosions, setExplosions] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const gameLoopRef = useRef(null);
  const canvasRef = useRef(null);
  const lastEnemySpawnRef = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    dispatch({ type: 'INIT_GAME' });
    setExplosions([]);
    setIsVerifying(false);
  }, []);

  // Handle mouse movement tracking
  const handleMouseMove = useCallback((mouseData) => {
    if (gameState.gameActive) {
      const moveData = trackMouseMove(mouseData.x, mouseData.y, mouseData.timestamp);
      dispatch({
        type: 'UPDATE_ANALYTICS',
        data: {
          mouseMoves: [...(gameState.analytics.mouseMoves || []), moveData]
        }
      });
    }
  }, [gameState.gameActive, gameState.analytics.mouseMoves]);

  // Handle shooting
  const handleShoot = useCallback((clickData) => {
    if (!gameState.gameActive || gameState.gameWon) return;

    const playerX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const playerY = 50;
    
    const bullet = createBullet(playerX, playerY, clickData.x, clickData.y);
    bullet.id = `bullet_${Date.now()}_${Math.random()}`;
    
    dispatch({ type: 'ADD_BULLET', bullet });

    // Track reaction time (time from game start to click)
    if (gameState.startTime) {
      const reactionTime = calculateReactionTime(gameState.startTime, clickData.timestamp);
      dispatch({
        type: 'UPDATE_ANALYTICS',
        data: {
          reactionTimes: [...(gameState.analytics.reactionTimes || []), reactionTime]
        }
      });
    }
  }, [gameState.gameActive, gameState.gameWon, gameState.startTime, gameState.analytics.reactionTimes]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameState.gameActive) return;

    // Update bullet positions
    const updatedBullets = gameState.bullets
      .map(updateBulletPosition)
      .filter(bullet => !isBulletOutOfBounds(bullet, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT));

    // Process collisions
    const collisionResults = processCollisions(updatedBullets, gameState.enemies);
    
    // Handle hits
    if (collisionResults.hits.length > 0) {
      collisionResults.hits.forEach(hit => {
        // Create explosion
        const explosion = {
          id: `explosion_${Date.now()}_${Math.random()}`,
          x: hit.position.x,
          y: hit.position.y
        };
        setExplosions(prev => [...prev, explosion]);

        // Update score and analytics
        dispatch({ type: 'UPDATE_SCORE', points: 1 });
        dispatch({
          type: 'UPDATE_ANALYTICS',
          data: {
            hits: (gameState.analytics.hits || 0) + 1
          }
        });
      });

      // Remove hit enemies
      collisionResults.hits.forEach(hit => {
        dispatch({ type: 'REMOVE_ENEMY', enemyId: hit.enemyId });
      });
    }

    // Update bullets
    dispatch({ type: 'UPDATE_BULLETS', bullets: collisionResults.bullets });

    // Spawn enemies
    const now = Date.now();
    if (now - lastEnemySpawnRef.current > 1000 && // At least 1 second between spawns
        shouldSpawnEnemy(gameState.enemies, GAME_CONFIG.MAX_ENEMIES, GAME_CONFIG.SPAWN_RATE)) {
      const enemy = createEnemy(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      dispatch({ type: 'ADD_ENEMY', enemy });
      lastEnemySpawnRef.current = now;
    }

    // Check win condition
    if (gameState.score >= GAME_CONFIG.TARGET_SCORE && !gameState.gameWon) {
      dispatch({ type: 'GAME_WON' });
      if (onGameComplete) {
        onGameComplete(gameState.analytics);
      }
    }
  }, [gameState, onGameComplete]);

  // Start game loop
  useEffect(() => {
    if (gameState.gameActive && !gameState.gameWon) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameActive, gameState.gameWon, gameLoop]);

  // Handle explosion cleanup
  const handleExplosionComplete = useCallback((explosionId) => {
    setExplosions(prev => prev.filter(exp => exp.id !== explosionId));
  }, []);

  // Handle verification
  const handleVerify = useCallback(async () => {
    if (gameState.score < GAME_CONFIG.TARGET_SCORE) return;
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      if (onVerified) {
        onVerified({
          isHuman: true,
          score: 95,
          analytics: gameState.analytics,
          sessionId: `session_${Date.now()}`
        });
      }
      setIsVerifying(false);
    }, 2000);
  }, [gameState.score, gameState.analytics, onVerified]);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <motion.div
        className="bg-white rounded-3xl shadow-game p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Security badge */}
        <div className="absolute top-5 right-5 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          🔒 Gaming Security
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
            🎮
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            GameCaptcha
          </h1>
        </div>

        <p className="text-gray-600 text-lg font-semibold mb-8 text-center">
          Prove you're human by playing a mini-game!
        </p>

        {/* Game area */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 mb-6 border-4 border-yellow-400 shadow-inner">
          <h2 className="text-2xl font-extrabold text-red-600 mb-4 text-center flex items-center justify-center gap-2">
            🎯 Shoot {GAME_CONFIG.TARGET_SCORE} Enemies to Continue
          </h2>
          
          <div className="bg-black rounded-xl p-5 mb-4 min-h-64 flex flex-col items-center justify-center relative border-4 border-gray-800">
            <ScoreDisplay 
              score={gameState.score}
              targetScore={GAME_CONFIG.TARGET_SCORE}
              gameWon={gameState.gameWon}
            />
            
            <GameCanvas
              ref={canvasRef}
              width={GAME_CONFIG.CANVAS_WIDTH}
              height={GAME_CONFIG.CANVAS_HEIGHT}
              onMouseMove={handleMouseMove}
              onClick={handleShoot}
              className="mb-3"
            >
              {/* Player */}
              <Player 
                x={GAME_CONFIG.CANVAS_WIDTH / 2}
                y={50}
                size={GAME_CONFIG.PLAYER_SIZE}
              />

              {/* Enemies */}
              <AnimatePresence>
                {gameState.enemies.map(enemy => (
                  <Enemy
                    key={enemy.id}
                    x={enemy.x}
                    y={enemy.y}
                    size={GAME_CONFIG.ENEMY_SIZE}
                    id={enemy.id}
                  />
                ))}
              </AnimatePresence>

              {/* Bullets */}
              <AnimatePresence>
                {gameState.bullets.map(bullet => (
                  <Bullet
                    key={bullet.id}
                    x={bullet.x}
                    y={bullet.y}
                    width={GAME_CONFIG.BULLET_SIZE.width}
                    height={GAME_CONFIG.BULLET_SIZE.height}
                    id={bullet.id}
                  />
                ))}
              </AnimatePresence>

              {/* Explosions */}
              <AnimatePresence>
                {explosions.map(explosion => (
                  <Explosion
                    key={explosion.id}
                    x={explosion.x}
                    y={explosion.y}
                    id={explosion.id}
                    onComplete={handleExplosionComplete}
                  />
                ))}
              </AnimatePresence>
            </GameCanvas>
            
            <div className="text-green-400 font-mono text-sm text-center">
              CLICK to SHOOT | MOUSE to AIM
            </div>
            <div className="bg-black bg-opacity-80 text-green-400 px-3 py-2 rounded-lg text-xs font-mono mt-2 border border-green-400">
              Only humans can aim and react this fast! 🎮
            </div>
          </div>
        </div>

        {/* Human score display */}
        {gameState.gameWon && (
          <motion.div
            className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-4 mb-4 text-green-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            🧠 Human Reflexes Detected: 96% - Excellent hand-eye coordination!
          </motion.div>
        )}

        {/* Verify button */}
        <VerifyButton
          score={gameState.score}
          targetScore={GAME_CONFIG.TARGET_SCORE}
          onClick={handleVerify}
          isVerifying={isVerifying}
          disabled={gameState.score < GAME_CONFIG.TARGET_SCORE}
        />
        
        {/* Reset button */}
        <motion.button
          className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          onClick={initGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔄 Reset Game
        </motion.button>
      </motion.div>
    </div>
  );
}