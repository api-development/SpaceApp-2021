module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        spgray: "#202124",
      },
      fontFamily: {
        inconsolata: ["inconsolata", "mono"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
