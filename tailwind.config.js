// https://tailwindcss.com/docs/customizing-colors
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'transparent': 'transparent',
        'main': '#010033',
        'highlight-blue': '#00BEDB',
        'pink': '#FF38ED',
        'light-gray': '#F5F5F5'
      }
    },
  },
  plugins: [],
}

