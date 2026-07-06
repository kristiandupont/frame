import path from "node:path";

/**
 * `index` files should be pure barrels: they may only re-export from other
 * modules (`export { x } from "./x"`, `export * from "./x"`, including the
 * `export type` variants). Any other statement — local declarations, local
 * `export { x }` without a source, plain or side-effect imports, or executable
 * code — belongs in a named file.
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Index files may only re-export (barrel files).",
      recommended: true,
    },
    schema: [],
    messages: {
      noLocalExport:
        "Index files may only re-export from other modules; use `export ... from`.",
      noImport:
        "Index files may only re-export; use `export ... from` instead of a separate import.",
      noCode: "Index files may only re-export from other modules, not contain code.",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    const base = path.basename(filename, path.extname(filename));

    if (base !== "index") return {};

    return {
      Program(program) {
        for (const stmt of program.body) {
          // `export * from "..."` / `export * as ns from "..."`
          if (stmt.type === "ExportAllDeclaration") continue;

          // `export { x } from "..."` / `export type { x } from "..."`
          if (stmt.type === "ExportNamedDeclaration") {
            if (stmt.source) continue;
            context.report({ node: stmt, messageId: "noLocalExport" });
            continue;
          }

          if (stmt.type === "ImportDeclaration") {
            context.report({ node: stmt, messageId: "noImport" });
            continue;
          }

          context.report({ node: stmt, messageId: "noCode" });
        }
      },
    };
  },
};
