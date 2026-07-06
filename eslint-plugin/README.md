# @kristiandupont/eslint-plugin

Custom ESLint rules shared across my projects. Authored as a flat-config plugin.

## Rules

| Rule | Description |
| --- | --- |
| `no-multiple-parameters-in-endpoint` | Endpoint callbacks (`router.query("x", (input) => …)`) may take at most one parameter. |
| `match-exported` | A named file's basename must match its default export (`Foo.tsx` → `export default Foo`). `index` files are exempt. |
| `index-barrel-only` | `index` files may only re-export (`export … from`); no local code, declarations, or imports. |

## Usage (flat config)

```js
import kristiandupont from "@kristiandupont/eslint-plugin";

export default [
  kristiandupont.configs.recommended, // registers the plugin + turns all rules on
];
```

Or register manually to pick rules:

```js
import kristiandupont from "@kristiandupont/eslint-plugin";

export default [
  {
    plugins: { "@kristiandupont": kristiandupont },
    rules: { "@kristiandupont/index-barrel-only": "error" },
  },
];
```
