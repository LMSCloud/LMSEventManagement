module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
  overrides: [
    {
      files: ["src/**/*.ts"],
      options: {
        tabWidth: 4,
      },
    },
  ],
};
