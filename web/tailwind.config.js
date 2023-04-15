/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#A7C957",
        secondary: "#F2E8CF",
        utility: "#BC4749",
        darker1: "#6A994E",
        darker2: "#386641",
      },
      fontFamily: {
        sans: ['"Mukta"', "sans-serif"],
        home: ['"DynaPuff"', "cursive"],
        main: ['"Mukta"', "sans-serif"],
      },
      gridTemplateColumns: {
        19: "repeat(19, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        19: "repeat(19, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
