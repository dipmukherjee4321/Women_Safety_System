/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': {
          dark: '#0f172a',
          purple: '#6b21a8',
          red: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
