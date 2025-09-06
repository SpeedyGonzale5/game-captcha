/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        game: {
          bg: '#000000',
          player: '#ff4444',
          enemy: '#666666',
          bullet: '#ffff00',
          explosion: '#ff6b35',
          success: '#10b981',
          warning: '#fbbf24',
        }
      },
      animation: {
        'explode': 'explode 0.5s ease-out forwards',
        'blink': 'blink 1s infinite',
        'fall': 'fall 3s linear forwards',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        explode: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0.3' }
        },
        fall: {
          '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        'card-gradient': 'linear-gradient(135deg, #fff1f2, #fef7f7)',
        'success-gradient': 'linear-gradient(135deg, #10b981, #059669)',
        'rainbow-gradient': 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
      },
      boxShadow: {
        'game': '0 30px 60px rgba(0,0,0,0.2)',
        'neon-green': '0 0 5px #00ff00',
        'neon-yellow': '0 0 8px #ffff00',
      },
      dropShadow: {
        'neon-green': '0 0 5px #00ff00',
        'neon-yellow': '0 0 8px #ffff00',
      }
    },
  },
  plugins: [],
}