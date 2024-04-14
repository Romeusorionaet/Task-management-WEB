/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      gap: {
        "17": "4.2rem",
      },
      fontFamily: {
        Roboto: 'Roboto, sans-serif',
      }
    },
  },
  plugins: [],
}

