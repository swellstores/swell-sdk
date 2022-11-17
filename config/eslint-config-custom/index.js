module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "turbo",
    "prettier",
  ],
  rules: {
    // "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};
