/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk:   ['Anton', 'system-ui', 'sans-serif'],
        condiment: ['Condiment', 'cursive'],
        mono:      ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        background: '#010828',
        cream:      '#EFF4FF',
        neon:       '#6FFF00',
      },
    },
  },
  plugins: [],
};
