/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8ED',
        strawberry: { DEFAULT: '#F7B8C8', deep: '#EA6A90', dark: '#B83A5A' },
        cherry: { DEFAULT: '#D92D43', dark: '#A81F33' },
        kiss: { red: '#B3282D', green: '#1E6B43', cream: '#F8EDD0', gold: '#C9953B' },
        aqua: { DEFAULT: '#2D96E3', soft: '#BFE3F7', mint: '#C5F0DC' },
        indigo: { DEFAULT: '#34406E', soft: '#D9DEF2' },
        caramel: { DEFAULT: '#9A5A25', soft: '#F2D6A8' },
        custard: '#F7C95A',
        lime: '#D8EDB0',
        lilac: '#D5C4F2',
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
        sticker: '0 2px 0 rgba(255,255,255,.9), 0 6px 14px -4px rgba(146,116,95,.5)',
        plaque: '0 0 0 2px #F8EDD0, 0 0 0 4px #B3282D, 0 10px 22px -8px rgba(94,69,53,.5)',
      },
      borderRadius: { '4xl': '2rem' },
    },
  },
  plugins: [],
};
