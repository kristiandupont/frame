/*
 * Smoke test for the published-facing eslint config.
 *
 * Version numbers are not the thing that breaks; config *shape* is. When a
 * plugin ships a major that renames an export, drops a processor, or changes
 * the flat-config contract, the dependency bump still looks green to a bot.
 * This loads each entry point and actually lints a file, the way README.md
 * tells consumers to, so a bad upgrade fails CI instead of shipping.
 *
 * Usage: node ../scripts/smoke-eslint-config.mjs   (run from eslint-config/)
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

// This script lives in scripts/ but runs from a package dir. Both `eslint` and
// the config under test must resolve from the *package*, not from here.
const requireFromPackage = createRequire(pathToFileURL(`${process.cwd()}/`));
const { ESLint } = requireFromPackage("eslint");

// The base config enables type-aware rules, which throw rather than skip when
// no TS project is supplied. README.md tells consumers to wire parserOptions,
// so the smoke test does the same — otherwise we would be testing a setup
// nobody actually uses.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "eslint-config-smoke-"));
fs.writeFileSync(
  path.join(fixture, "tsconfig.json"),
  JSON.stringify({ compilerOptions: { strict: true, target: "es2022", module: "esnext" }, include: ["*.ts"] }),
);
fs.writeFileSync(path.join(fixture, "sample.ts"), "const x: number = 1;\nexport default x;\n");

const typeAware = {
  files: ["**/*.ts"],
  languageOptions: { parserOptions: { project: "./tsconfig.json", tsconfigRootDir: fixture } },
};

const load = async (entry) => {
  const target = new URL(entry, pathToFileURL(`${process.cwd()}/`)).href;
  const { default: config } = await import(target);
  if (!Array.isArray(config)) {
    throw new Error(`${entry}: expected a flat-config array, got ${typeof config}`);
  }
  return config;
};

// ./node is a composable overlay, not a standalone config — on its own it has
// no TS parser. Test the combinations README.md actually documents.
const base = await load("./index.js");
const node = await load("./node.js");

const CASES = {
  "base": base,
  "base + node": [...base, ...node],
};

let failed = false;

for (const [entry, config] of Object.entries(CASES)) {
  try {
    const eslint = new ESLint({
      cwd: fixture,
      overrideConfigFile: true,
      overrideConfig: [...config, typeAware],
    });
    const [result] = await eslint.lintFiles([path.join(fixture, "sample.ts")]);

    // Rule violations are fine — we are testing that the config loads and runs.
    // Fatal parse/config errors are not.
    const fatal = result.messages.filter((m) => m.fatal);
    if (fatal.length > 0) {
      throw new Error(fatal.map((m) => m.message).join("; "));
    }

    console.log(`ok   ${entry} (${result.messages.length} rule message(s))`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${entry}: ${error.message.split("\n")[0]}`);
  }
}

fs.rmSync(fixture, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
