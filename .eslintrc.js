module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:wc/recommended",
    "plugin:lit/recommended"
  ],
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    project: "./tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname
  },
  plugins: ["@typescript-eslint"]
}
