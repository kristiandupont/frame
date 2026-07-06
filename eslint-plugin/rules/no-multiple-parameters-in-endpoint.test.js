import { RuleTester } from "eslint";

import rule from "./no-multiple-parameters-in-endpoint.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: "latest", sourceType: "module" },
});

ruleTester.run("no-multiple-parameters-in-endpoint", rule, {
  valid: [
    'router.query("a", () => 1);',
    'router.query("a", (input) => input);',
    'router.mutation("a", async (input) => input);',
    // Not a router call — ignored.
    'other.query("a", (input, extra) => input);',
    // Non-function second argument — ignored.
    'router.query("a", config);',
  ],
  invalid: [
    {
      code: 'router.query("a", (input, ctx) => input);',
      errors: [{ messageId: "tooManyParams" }],
    },
    {
      code: 'router.mutation("a", function (input, ctx) { return input; });',
      errors: [{ messageId: "tooManyParams" }],
    },
  ],
});
