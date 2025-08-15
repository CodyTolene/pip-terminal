const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const path = require('path');

module.exports = tseslint.config({
  files: ["**/*.ts"],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: path.resolve(__dirname),
    },
  },
  rules: {
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "never",
      },
    ],
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      { accessibility: "explicit" },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          "constructor",
          "static-field",
          "instance-field",
          "static-method",
          "instance-method",
        ],
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "classProperty",
        format: ["PascalCase", "camelCase"],
        modifiers: ["public"],
      },
      {
        selector: "function",
        format: ["camelCase"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: false,
        },
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
    ],
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/prefer-for-of": ["warn"],
    "@typescript-eslint/prefer-function-type": ["warn"],
    "@typescript-eslint/unified-signatures": "warn",
    eqeqeq: ["error"],
    "guard-for-in": ["error"],
    "no-bitwise": ["error"],
    "no-caller": ["error"],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-duplicate-imports": ["error"],
    "no-empty": "error",
    "no-eval": ["error"],
    "no-new-wrappers": ["error"],
    "no-throw-literal": ["error"],
    "no-var": ["error"],
    "object-shorthand": ["error"],
    "one-var": ["error", "never"],
    "prefer-const": ["error"],
    radix: ["error"],
    "spaced-comment": ["error", "always", { block: { balanced: true } }],
  },
});
