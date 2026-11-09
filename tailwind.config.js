/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8ED',
        strawberry: { DEFAULT: '#F7B8C8', deep: '#E8869F', dark: '#C9566F' },
        matcha: { DEFAULT: '#B9CBA5', deep: '#7E9A63', dark: '#4F6B3A' },
        butter: '#F6E5A9',
        sky: '#C9E2EF',
        cocoa: { DEFAULT: '#92745F', dark: '#5E4535', light: '#C7AE98' },
        peach: '#F5D0BE',
      },
      fontFamily: {
        body: ['Mali', '"Zen Maru Gothic"', 'system-ui', 'sans-serif'],
        display: ['"Mochiy Pop One"', 'Mali', 'system-ui', 'sans-serif'],
        jp: ['"Zen Maru Gothic"', 'Mali', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 20px -6px rgba(146,116,95,0.35)',
        card: '0 10px 30px -12px rgba(146,116,95,0.45), 0 2px 0 rgba(255,255,255,0.8) inset',
        btn: '0 4px 0 0 rgba(146,116,95,0.35)',
      },
      borderRadius: { '4xl': '2rem' },
    },
  },
  plugins: [],
};
