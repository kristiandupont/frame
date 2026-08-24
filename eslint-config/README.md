# @kristiandupont/eslint-config

Shared flat ESLint config. Correctness-focused — stylistic concerns (formatting,
import ordering) are intentionally left to the editor. Requires ESLint 9+.

Exports two composable flat-config arrays:

- `.` (base) — JS + TypeScript correctness rules, the `@kristiandupont` custom
  plugin, and `@generated`-file skipping.
- `./node` — `eslint-plugin-n` for backend/tooling source.

> React support was removed in v4. `eslint-plugin-react` and
> `eslint-plugin-jsx-a11y` both cap their ESLint peer range at 9, which held the
> whole fleet on a deprecated ESLint. React projects should configure those
> plugins directly.

## Usage (`eslint.config.js`)

```js
import base from "@kristiandupont/eslint-config";
import node from "@kristiandupont/eslint-config/node";

export default [
  ...base,
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
