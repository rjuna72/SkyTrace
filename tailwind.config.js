/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#080c14',
        surface: '#0e1521',
        border: '#1a2438',
        accent: '#00d4ff',
        warn: '#ff6b35',
        danger: '#ff2d55',
        success: '#00e5a0',
        muted: '#4a5878',
        text: {
          primary: '#e8edf8',
          secondary: '#8899bb',
          dim: '#4a5878',
        }
      },
    },
  },
  plugins: [],
}
