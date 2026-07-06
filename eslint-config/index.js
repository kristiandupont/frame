import js from "@eslint/js";
import kristiandupont from "@kristiandupont/eslint-plugin";
import ignoreGenerated from "eslint-plugin-ignore-generated";
import tseslint from "typescript-eslint";

// Base config: correctness-oriented rules for TypeScript. Purely stylistic
// concerns (formatting, import ordering) are intentionally left to the editor.
// Type-aware rules are enabled here but only take effect where the consumer
// sets `languageOptions.parserOptions` (project / projectService).
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  kristiandupont.configs.recommended,
  // Skip files marked `@generated` (e.g. Kanel output). This plugin only ships
  // per-extension processors, so wire them explicitly per file glob.
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    processor: ignoreGenerated.processors[".ts"],
  },
  {
    files: ["**/*.tsx"],
    processor: ignoreGenerated.processors[".tsx"],
  },
  {
    rules: {
      "no-unused-expressions": "error",
      "no-implicit-coercion": "error",
      "no-unused-labels": "error",
      "no-process-env": "error",
      "no-restricted-syntax": [
        "error",
        "ForInStatement",
        "LabeledStatement",
        "WithStatement",
      ],
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "prefer-const": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
];
