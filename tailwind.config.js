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
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
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
        'loading': 'expanding 0.4s 0.7s forwards linear, moving 1s 1s infinite forwards linear',
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
        },
        shine: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        expanding: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' }
        },
        moving: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'button-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'success-gradient': 'linear-gradient(135deg, #10b981, #059669)',
        'purple-pink': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'blue-purple': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      boxShadow: {
        'game': '0 30px 60px rgba(0,0,0,0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
        'button-3d': '0 4px 15px 0 rgba(31, 38, 135, 0.4)',
        'button-pressed': '0 2px 8px 0 rgba(31, 38, 135, 0.4)',
        'neon-green': '0 0 5px #00ff00',
        'neon-yellow': '0 0 8px #ffff00',
        'glass-light': '0 10px 30px rgba(0, 0, 0, 0.2)',
        'inner-glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
      },
      dropShadow: {
        'neon-green': '0 0 5px #00ff00',
        'neon-yellow': '0 0 8px #ffff00',
      },
      backdropBlur: {
        'glass': '10px',
        'strong': '20px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      borderRadius: {
        'glass': '16px',
        'button': '12px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}