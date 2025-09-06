# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Creative CAPTCHA** project - an innovative AI-powered security platform that uses creative drawing challenges to verify human users. Users draw objects which are then transformed into beautiful AI-generated artwork, making verification both secure and enjoyable.

## Architecture

- **Next.js 15+ Application**: Modern React framework with App Router
- **Component-based**: Modular React components with TypeScript-style documentation
- **Canvas-based Drawing**: HTML5 Canvas with mouse/touch support for smooth drawing
- **AI Integration**: Mock integrations with Nano Banana (artwork) and ElevenLabs (music)
- **Security Analytics**: Behavioral analysis of drawing patterns, timing, and creativity

### Core Drawing Components

- **DrawingCanvas**: HTML5 canvas with smooth drawing, touch support, and stroke recording
- **DrawingTools**: Color picker, brush size slider, clear/undo functionality
- **AIArtworkDisplay**: Shows original drawing + AI-enhanced artwork side-by-side
- **Drawing Analytics**: Security analysis of stroke patterns, timing, and human-like behavior
- **Prompt System**: Random drawing challenges (fish, cat, house, tree, car, etc.)

### Key Drawing Mechanics

- Smooth mouse/touch drawing with configurable brush sizes and colors
- Stroke recording with timing and coordinate data for security analysis
- Real-time canvas clearing and undo functionality
- Drawing validation against prompted objects
- AI artwork generation with style transfer and enhancement
- Background music generation based on drawing theme

## Development Commands

- **Development**: `npm run dev` - Start development server on http://localhost:3000
- **Build**: `npm run build` - Create production build with optimization
- **Start**: `npm run start` - Serve production build
- **Lint**: `npm run lint` - Check code quality with ESLint
- **Preview**: `npm run preview` - Build and serve for testing

## File Structure

```
src/
├── components/
│   ├── games/
│   │   └── DrawingGame.jsx     # Main drawing challenge component
│   ├── ui/
│   │   ├── DrawingCanvas.jsx   # HTML5 canvas drawing interface
│   │   ├── DrawingTools.jsx    # Color/size controls and actions
│   │   ├── AIArtworkDisplay.jsx # AI artwork showcase
│   │   └── VerifyButton.jsx    # Submission and verification
├── lib/
│   ├── drawingAnalytics.js     # Security analysis of drawing patterns
│   ├── mockAI.js              # Nano Banana & ElevenLabs integration
│   ├── securityAnalytics.js   # General behavioral analysis utilities
│   └── types.js               # Type definitions and constants
├── app/
│   ├── api/
│   │   ├── verify/route.js     # Drawing verification endpoint
│   │   └── analytics/route.js  # Analytics storage endpoint
│   ├── demo/page.js           # Interactive demo page
│   ├── embed/page.js          # Embeddable widget
│   └── page.js                # Main application
```

## Key Implementation Details

### Drawing System
- HTML5 Canvas with 2D context for smooth drawing
- Real-time stroke capture with coordinates and timestamps
- Touch event support for mobile devices
- Configurable brush size (1-12px) and color selection
- Undo/clear functionality with canvas redrawing

### Security Analysis
- **Stroke Patterns**: Analyzes natural variation in stroke length and complexity
- **Timing Analysis**: Measures pauses between strokes and drawing speed variance
- **Content Validation**: Basic heuristics to verify drawing matches prompt
- **Human Score**: Weighted algorithm combining multiple behavioral factors

### AI Integration (Mock)
- **Nano Banana**: Transforms drawings into beautiful SVG artwork with gradients
- **ElevenLabs**: Generates themed background music for each object type
- **Style Transfer**: Different artistic styles based on drawn objects
- **Processing Time**: 2-4 second simulation for realistic AI processing

### Verification Flow
1. User receives random prompt ("Draw a fish")
2. User draws on canvas with tools
3. System validates drawing has reasonable content
4. AI processes drawing into enhanced artwork
5. Security analysis calculates human probability score
6. User sees beautiful artwork + verification result

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: Touch events for iOS/Android drawing
- **Canvas Support**: HTML5 Canvas 2D context required
- **ES6+ Features**: Modern JavaScript with async/await
- **Responsive**: Works on desktop, tablet, and mobile devices

## Security Thresholds

- **Human Score Threshold**: 70+ points for verification
- **Minimum Strokes**: 2-3 strokes for simple objects
- **Drawing Time**: 5-60 seconds for optimal human behavior
- **Speed Variance**: Natural variation in drawing speed indicates human behavior
- **Pause Analysis**: Thinking time between strokes shows human planning