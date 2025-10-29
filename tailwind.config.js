/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5da',
          300: '#f0b3bd',
          400: '#e58599',
          500: '#d6547a',
          600: '#c13865',
          700: '#a32a54',
          800: '#88254a',
          900: '#742444',
          950: '#410f22',
        },
        wine: {
          50: '#fdf3f4',
          100: '#fce7eb',
          200: '#f9d2d9',
          300: '#f4adb9',
          400: '#ec7c94',
          500: '#e05277',
          600: '#ca2f5e',
          700: '#ab224c',
          800: '#8f1f44',
          900: '#7a1d3e',
          950: '#440b1e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
