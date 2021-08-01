const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        // primary: 'var(--color-bg-primary)',
        primary: '#ff9800',
        secondary: '#2979ff',
        // secondary: 'var(--color-bg-secondary)',
        accent: '#212121',
      },
      textColor: {
        accent: 'pink',
        primary: '#212121',
        secondary: '#edf0f2',
        dark: '#222222'
      },
    },
    colors: {
      // Build your palette here
      transparent: 'transparent',
      gray: colors.warmGray,
      red: colors.red,
      blue: colors.sky,
      orange: colors.amber,
    },
  },
  variants: {
    extend: { textColor: ['dark', 'responsive', 'hover', 'focus'], backgroundColor: ['dark', 'responsive', 'hover', 'focus'] },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
