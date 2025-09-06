# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **GameCaptcha** project - an innovative HTML-based CAPTCHA system that uses a mini-game to verify human users instead of traditional image or text challenges. The entire application is contained within a single HTML file (`main.html`) that includes embedded CSS and JavaScript.

## Architecture

- **Single-file architecture**: The entire application is contained in `main.html`
- **Vanilla JavaScript**: No external frameworks or libraries - pure HTML5, CSS3, and JavaScript
- **Canvas-based game**: Uses DOM manipulation to create a 2D shooting game within a styled game area
- **Real-time collision detection**: Bullet-enemy collision system with visual feedback
- **Embedded styling**: All CSS is included in a `<style>` block within the HTML head

### Core Game Components

- **Player**: Red circular player character positioned at bottom center
- **Enemies**: Alien emoji (👾) enemies that spawn randomly in the upper area
- **Bullets**: Yellow projectiles that travel from player toward click target
- **Collision System**: Real-time detection between bullets and enemies with explosion effects
- **Scoring**: Track destroyed enemies with visual feedback and completion at 3 enemies

### Key Game Mechanics

- Mouse movement tracking for aiming visualization
- Click-to-shoot bullet system with trajectory calculation
- Enemy spawning algorithm with randomized positions
- Collision detection using bounding box calculations
- Animation system using CSS transitions and JavaScript requestAnimationFrame
- Human verification metrics based on reaction time and accuracy

## Development Commands

Since this is a single HTML file project, there are no build tools, package managers, or test frameworks:

- **Run locally**: Open `main.html` directly in any modern web browser
- **Development**: Edit `main.html` directly - changes are immediately visible on browser refresh
- **Testing**: Manual testing in browser (no automated test framework)
- **Deployment**: Copy `main.html` to any web server or host directly

## File Structure

```
game-captcha/
├── main.html          # Complete application (HTML + CSS + JavaScript)
└── CLAUDE.md          # This documentation file
```

## Key Implementation Details

- Game loop runs via `requestAnimationFrame()` for smooth 60fps animation
- Collision detection uses rectangular bounding box intersection
- Mouse coordinates converted from screen space to game canvas space
- Player movement constrained to horizontal axis only
- Bullets move in straight line trajectories toward click coordinates
- Enemy spawning limited to 3 concurrent enemies maximum
- Success state triggers confetti animation and human verification score

## Browser Compatibility

- Requires modern browser with ES6+ support
- Uses CSS gradients, transforms, and animations
- Relies on DOM manipulation and event handling
- No external dependencies or polyfills needed