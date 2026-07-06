# @kristiandupont/eslint-config

Shared flat ESLint config. Correctness-focused — stylistic concerns (formatting,
import ordering) are intentionally left to the editor. Requires ESLint 9+.

Exports three composable flat-config arrays:

- `.` (base) — JS + TypeScript correctness rules, the `@kristiandupont` custom
  plugin, and `@generated`-file skipping.
- `./react` — React, React Hooks, and jsx-a11y (new JSX runtime).
- `./node` — `eslint-plugin-n` for backend/tooling source.

## Usage (`eslint.config.js`)

```js
import base from "@kristiandupont/eslint-config";
import react from "@kristiandupont/eslint-config/react";
import node from "@kristiandupont/eslint-config/node";

export default [
  ...base,
  ...react,
  ...node,
  {
    // Type-aware rules (e.g. prefer-nullish-coalescing) only activate where a
    // TS project is provided.
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parserOptions: { project: "./tsconfig.json" },
    },
  },
];
```

> React version is pinned (to 18) in `./react` because `settings.react.version:
> "detect"` uses APIs removed in ESLint 10. Override in your own config if you're
> on a different React major.
