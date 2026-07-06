import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

// React config. Uses the new JSX runtime (no `React` import required), so
// `react-in-jsx-scope` / `react/prop-types` are handled by `jsx-runtime`.
export default [
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    settings: {
      // `detect` calls APIs removed in ESLint 10; pin instead. Consumers on a
      // different React major can override this in their own config.
      react: { version: "18.0" },
    },
  },
];
