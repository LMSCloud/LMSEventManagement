module.exports = {
  plugins: [
    require("prettier-plugin-tailwindcss"),
    "prettier-plugin-organize-imports",
  ],
  overrides: [
    {
      files: ["src/**/*.ts"],
      options: {
        tabWidth: 4,
      },
    },
  ],
};
