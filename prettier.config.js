module.exports = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
  overrides: [
    {
      files: ["src/**/*.ts"],
      options: {
        tabWidth: 4,
      },
    },
  ],
};
