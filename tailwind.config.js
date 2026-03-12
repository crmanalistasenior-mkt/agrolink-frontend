/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#22c55e',
        'brand-dark': '#16a34a',
        base: '#020617',
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
