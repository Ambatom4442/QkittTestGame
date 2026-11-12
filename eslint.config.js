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
        URL: "readonly",
        console: "readonly",
        process: "readonly"
      }
    }
  },
  {
    files: ["client/**/*.js"],
    languageOptions: {
      globals: {
        URLSearchParams: "readonly",
        document: "readonly",
        fetch: "readonly",
        window: "readonly"
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
    files: ["shared/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["client/*", "server/*", "content/*", "harness/*"]
        }
      ]
    }
  },
  {
    files: ["client/src/engine/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["client/src/game/*", "client/src/ui/*", "client/src/state/*", "client/src/app/*"]
        }
      ]
    }
  },
  {
    files: ["client/src/game/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["client/src/ui/*", "client/src/app/*"]
        }
      ]
    }
  },
  {
    files: ["client/src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["client/src/engine/*", "client/src/game/*", "client/src/app/*"]
        }
      ]
    }
  },
  {
    files: ["client/src/state/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["client/src/engine/*", "client/src/game/*", "client/src/ui/*", "client/src/app/*"]
        }
      ]
    }
  },
  {
    files: ["client/src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["client/src/engine/*"]
        }
      ]
    }
  },
  {
    files: ["server/src/rules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["server/src/http/*", "server/src/repo/*", "server/src/db/*", "node:fs", "fs"]
        }
      ]
    }
  },
  {
    files: ["server/src/repo/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["server/src/http/*", "server/src/rules/*"]
        }
      ]
    }
  },
  {
    files: ["server/src/http/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["server/src/db/*"]
        }
      ]
    }
  },
  {
    files: ["client/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "content/cases/*/deductions*",
            "content/cases/*/red-herrings*",
            "content/cases/*/hints*",
            "content/cases/*/explanation*"
          ]
        }
      ]
    }
  }
];
