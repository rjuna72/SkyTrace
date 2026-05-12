/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#00152e',
        surface: '#001840',
        'surface-2': '#00245c',
        border:  '#00306b',
        accent:  '#00a0dc',
        warn:    '#ffaa00',
        danger:  '#ff3d5a',
        success: '#00d68f',
        muted:   '#3d6080',
        text: {
          primary:   '#e8f0fb',
          secondary: '#8fafd4',
          dim:       '#3d6080',
        },
      },
    },
  },
  plugins: [],
}
