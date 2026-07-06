/**
 * Endpoint definitions look like `router.query("name", (input) => ...)`.
 * The callback receives a single context/input argument, so more than one
 * parameter is almost always a mistake (e.g. treating it like an Express
 * handler with `(req, res)`).
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Endpoint callbacks should have zero or one parameter.",
      recommended: true,
    },
    schema: [],
    messages: {
      tooManyParams: "Endpoint callbacks should have zero or one parameter.",
    },
  },
  create(context) {
    return {
      "CallExpression[callee.type='MemberExpression'][callee.object.name='router']"(
        node,
      ) {
        const callback = node.arguments[1];
        if (
          callback &&
          (callback.type === "ArrowFunctionExpression" ||
            callback.type === "FunctionExpression") &&
          callback.params.length > 1
        ) {
          context.report({ node: callback, messageId: "tooManyParams" });
        }
      },
    };
  },
};
