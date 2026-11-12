import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "coverage/**", "dist/**", "q_heat_kit/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs", "server/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly"
      }
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        expect: "readonly",
        fetch: "readonly",
        it: "readonly"
      }
    }
  },
  {
    files: ["shared/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "patterns": ["client/*", "server/*", "content/*", "harness/*"]
        }
      ]
    }
  }
];
