const {tailwindTransform} = require("postcss-lit");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: { files: ["src/**/*.ts"], transform: { ts: tailwindTransform } },
  theme: {
    extend: {},
  },
  plugins: [],
};
