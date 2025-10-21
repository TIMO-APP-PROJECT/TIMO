/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxWidth: { app: '393px', tablet: '480px' },
      height: {
        17: '4.125rem', // 66px
      },
      screens: { tab: '768px' },
      container: { center: true, padding: '16px' },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
        mono: ['var(--font-jetbrains-mono)'],
      },
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
