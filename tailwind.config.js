const { tailwindTransform } = require("postcss-lit");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: { files: ["src/**/*.ts"], transform: { ts: tailwindTransform } },
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      "corporate",
      // {
      //   LMSCloud: {
      //     "primary": "#db72bd",
      //     "secondary": "#2044f7",
      //     "accent": "#79b71b",
      //     "neutral": "#2b2c36",
      //     "base-100": "#faf8fc",
      //     "info": "#97d0ed",
      //     "success": "#18bf5a",
      //     "warning": "#a3630f",
      //     "error": "#fb6a80"
      //   }
      // }
    ],
  },
};
