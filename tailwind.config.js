/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        smoothPurple: "rgb(204, 102, 255)",
        Purple: "rgb(117,104,242)",
        hoverPurple: "rgb(60,51,115)",
        black: "#222F34",
        darkBlack: "#111A20",
        green: "#59B223",
        smoothBlack: "rgb(71, 98, 108)",
      },
    },
  },
  plugins: [],
};
