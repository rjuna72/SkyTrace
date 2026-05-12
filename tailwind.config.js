/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        tight: ['Inter Tight', 'sans-serif'],
      },
      colors: {
        ab:      '#00205b',
        'ab-dark':  '#001640',
        'ab-mid':   '#00306b',
        'ab-light': '#0077c8',
        'ab-cyan':  '#4298b5',
        'ab-sky':   '#74d2e7',
        'ab-grey':  '#e8ecf0',
        'ab-grey2': '#b0bec8',
        'ab-grey3': '#6b7c8a',
        'ab-off':   '#f4f6f9',
        surface: '#ffffff',
        border:  '#e8ecf0',
        accent:  '#0077c8',
        success: '#009f4d',
        warn:    '#fe5000',
        danger:  '#e4002b',
        text: {
          primary:   '#1a2332',
          secondary: '#6b7c8a',
          dim:       '#b0bec8',
        },
      },
    },
  },
  plugins: [],
}
