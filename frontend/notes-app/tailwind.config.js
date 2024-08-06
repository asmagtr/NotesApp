/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //colors
      colors:{
        primary:"#ffc107",
        secondary:"#212121",
      },
      
    },
  },
  plugins: [],
}

