import path from "node:path";

/**
 * A named file's basename should match the name of its default export, so that
 * `Foo.tsx` exports `Foo`. `index` files are barrels (see `index-barrel-only`)
 * and are exempt. Anonymous default exports (`export default () => {}`,
 * `export default {}`) have no name to match against and are ignored.
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require a file's name to match its default export.",
      recommended: true,
    },
    schema: [],
    messages: {
      mismatch:
        "Filename '{{filename}}' does not match its default export '{{exported}}'.",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    const base = path.basename(filename, path.extname(filename));

    // Non-file inputs (e.g. RuleTester's "<input>") and index barrels are exempt.
    if (base === "index" || base.startsWith("<")) return {};

    return {
      ExportDefaultDeclaration(node) {
        const decl = node.declaration;
        let name;
        if (
          (decl.type === "FunctionDeclaration" ||
            decl.type === "ClassDeclaration") &&
          decl.id
        ) {
          name = decl.id.name;
        } else if (decl.type === "Identifier") {
          name = decl.name;
        }

        if (name && name !== base) {
          context.report({
            node,
            messageId: "mismatch",
            data: { filename: base, exported: name },
          });
        }
      },
    };
  },
};
