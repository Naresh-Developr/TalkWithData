/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryPurple: '#7b2cbf',
        secondaryPurple: '#9c4dcc',
        darkBg: '#1e1e2f',
        textWhite: '#ffffff',
      },
    },
  },
  plugins: [],
}

