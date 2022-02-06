// https://tailwindcss.com/docs/customizing-colors
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'primary-color': '#7D93FF',
      'secondary-color': '#D7DDFD',
      'gray': {
        100: '#f3f4f6',
        200: '#e5e7eb',
      }
      },
    extend: {
    },
  },
  plugins: [],
}
