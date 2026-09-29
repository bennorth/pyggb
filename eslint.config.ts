import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import pluginSecurity from "eslint-plugin-security";
export default defineConfig([
  globalIgnores(["public/vendor/", "dist/", "pages/"]),
  {
    files: ["**/*.ts", "**/*.mts", "**/*.tsx"],

    // Extend recommended rule sets from:
    // 1. ESLint JS's recommended rules
    // 2. TypeScript ESLint recommended rules
    // 3. ESLint React's recommended-typescript rules
    // 4. eslint-plugin-security's recommended rules
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs["recommended-typescript"],
      pluginSecurity.configs.recommended,
    ],

    // Configure language/parsing options
    languageOptions: {
      // Use TypeScript ESLint parser for TypeScript files
      parser: tseslint.parser,
      parserOptions: {
        // Enable project service for better TypeScript integration
        projectService: {
          // These are build-tooling config files not covered by
          // tsconfig.json's `include` — allow them to use a default,
          // non-type-checked project instead of failing to parse.
          allowDefaultProject: [
            "cypress.config.ts",
            "eslint.config.ts",
            "vite.config.mts",
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },

    // Custom rule overrides (modify rule levels or disable rules)
    rules: {
      "@eslint-react/no-missing-key": "warn",
      // The codebase uses "let" to highlight that an object will be
      // mutated, even if the binding itself is unchanged.
      "prefer-const": 0,
      // Allow suitably-named args to be unused.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "security/detect-object-injection": "off",
    },
  },
]);
