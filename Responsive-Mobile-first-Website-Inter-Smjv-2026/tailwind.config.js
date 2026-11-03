/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.jsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#070B1E',
          deep: '#050817',
          surface: '#0E1433',
          card: '#131A42',
          hover: '#192357',
          border: 'rgba(247, 244, 238, 0.12)',
        },
        saffron: {
          DEFAULT: '#FF7A1A',
          dark: '#E06200',
          light: '#FF9747',
        },
        marigold: {
          DEFAULT: '#FFC53D',
          glow: '#FFE08A',
        },
        vermilion: {
          DEFAULT: '#FF5A4E',
          live: '#FF3B30',
        },
        ink: {
          DEFAULT: '#F7F4EE',
          muted: '#9BA3CB',
          sub: '#CDD2EC',
        }
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        sans: ['"Archivo"', 'system-ui', 'sans-serif'],
        gu: ['"Noto Sans Gujarati"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 32s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

