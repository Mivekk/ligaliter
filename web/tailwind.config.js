/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "plt-three": "#7F7CAF",
        "plt-two": "#324376",
        "plt-one": "#B7B5D7",
        "plt-four": "#9FB4C7",
        "plt-five": "#F76C5E",
      },
      textColor: {
        "plt-three": "#7F7CAF",
        "plt-two": "#324376",
        "plt-one": "#B7B5D7",
        "plt-four": "#9FB4C7",
        "plt-five": "#F76C5E",
      },
    },
  },
  plugins: [],
};
