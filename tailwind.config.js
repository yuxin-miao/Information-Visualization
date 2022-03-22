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
        'filter-blue': '#1B4688',
        'pink': '#FF38ED',
        'light-gray': '#F5F5F5',
        'blue-start': 'rgba(66, 76, 109, 0.4)',
        'blue-end': 'rgba(11, 27, 97, 0.4)',
        'circle1-top': '#F323BF', 
        'circle1-bottom': '#382B62',
        'circle2-top': '#236FF3',
        'circle2-bottom': '#382B62',
        'circle3-top': '#7723F3',
        'circle3-bottom': '#382B62',
        'circle4-top': '#23F348',
        'circle4-bottom': '#382B62',
        'circle5-top': '#23F3D1',
        'circle5-bottom': '#382B62',
        'teaminfo-start': 'rgba(66, 76, 109, 0.9)',
        'teaminfo-end': 'rgba(11, 27, 97, 0.9)',
        'bl-end': '#147AD4',
        'bl-start': '#00427C',
      }
    },
  },
  plugins: [],
}

