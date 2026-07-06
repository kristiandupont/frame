import parser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";

import rule from "./match-exported.js";

const ruleTester = new RuleTester({
  languageOptions: { parser, ecmaVersion: "latest", sourceType: "module" },
});

ruleTester.run("match-exported", rule, {
  valid: [
    { code: "export default function Foo() {}", filename: "Foo.tsx" },
    { code: "export default class Foo {}", filename: "src/Foo.ts" },
    { code: "const Foo = 1;\nexport default Foo;", filename: "Foo.ts" },
    // index barrels are exempt.
    { code: "export default function anything() {}", filename: "index.ts" },
    // anonymous defaults have no name to match.
    { code: "export default () => {};", filename: "whatever.ts" },
    { code: "export default {};", filename: "whatever.ts" },
    // no default export at all.
    { code: "export const foo = 1;", filename: "bar.ts" },
  ],
  invalid: [
    {
      code: "export default function Foo() {}",
      filename: "Bar.tsx",
      errors: [{ messageId: "mismatch" }],
    },
    {
      code: "const Foo = 1;\nexport default Foo;",
      filename: "baz.ts",
      errors: [{ messageId: "mismatch" }],
    },
  ],
});
