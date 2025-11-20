const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@windmill/react-ui/config");

module.exports = windmill({
  purge: ["src/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      colors: {
        brandRed: "#C71320", // ✅ custom color alias
        brandLight: "rgb(228, 203, 206)",
        brandDisable: "#b9656a",
        brandHover: "#ac7e81",
      },
    },
  },
});
