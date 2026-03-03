module.exports = {
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss",
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
