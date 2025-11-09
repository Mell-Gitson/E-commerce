/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: '#016565',
        grayBanner: '#CFCECE', 
      },   
    },
  },
  plugins: [],
}

