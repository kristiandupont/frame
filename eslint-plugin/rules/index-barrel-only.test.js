import parser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";

import rule from "./index-barrel-only.js";

const ruleTester = new RuleTester({
  languageOptions: { parser, ecmaVersion: "latest", sourceType: "module" },
});

ruleTester.run("index-barrel-only", rule, {
  valid: [
    { code: 'export { Foo } from "./Foo";', filename: "index.ts" },
    { code: 'export * from "./Foo";', filename: "index.ts" },
    { code: 'export * as ns from "./Foo";', filename: "index.ts" },
    { code: 'export type { Foo } from "./Foo";', filename: "index.ts" },
    { code: 'export { default as Foo } from "./Foo";', filename: "index.ts" },
    // non-index files are unrestricted.
    { code: 'const x = 1;\nexport { x };', filename: "Foo.ts" },
    { code: 'import "./side-effect";', filename: "Foo.ts" },
  ],
  invalid: [
    {
      code: "export const x = 1;",
      filename: "index.ts",
      errors: [{ messageId: "noLocalExport" }],
    },
    {
      code: 'const x = 1;\nexport { x };',
      filename: "index.ts",
      errors: [{ messageId: "noCode" }, { messageId: "noLocalExport" }],
    },
    {
      code: 'import Foo from "./Foo";\nexport { Foo };',
      filename: "index.ts",
      errors: [{ messageId: "noImport" }, { messageId: "noLocalExport" }],
    },
    {
      code: 'import "./side-effect";',
      filename: "index.ts",
      errors: [{ messageId: "noImport" }],
    },
    {
      code: 'console.log("hi");',
      filename: "index.ts",
      errors: [{ messageId: "noCode" }],
    },
    {
      code: "export default function Foo() {}",
      filename: "index.ts",
      errors: [{ messageId: "noCode" }],
    },
  ],
});
