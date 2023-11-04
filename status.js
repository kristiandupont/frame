/*
 * This script checks the status of the packages in the monorepo.
 * It checks if the dependencies in the local package.json files are the same as the published package.json files.
 * Usage: node status.js
 */

import fs from "fs/promises";
import { promisify } from "util";
import packageJson from "pkg.json";
import chalk from "chalk";

const loadJsonFile = async (path) => {
  const contents = await fs.readFile(path, "utf8");
  return JSON.parse(contents);
};

const diffObjects = (a = {}, b = {}) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  const added = bKeys.filter((key) => !aKeys.includes(key));
  const removed = aKeys.filter((key) => !bKeys.includes(key));
  const changed = aKeys.filter(
    (key) => a[key] !== b[key] && bKeys.includes(key),
  );
  const hasChanges = added.length || removed.length || changed.length;

  return { hasChanges, added, removed, changed };
};

const pkgJson = promisify(packageJson);

const rootPackageJson = await loadJsonFile("./package.json");
const packages = rootPackageJson.workspaces;

async function checkPackage(pkg) {
  console.info(`Checking ${chalk.green(pkg)}`);
  const local = await loadJsonFile(`${pkg}/package.json`);
  const published = await pkgJson(`@kristiandupont/${pkg}`, "latest");

  const depsDiff = diffObjects(local.dependencies, published.dependencies);
  const devDepsDiff = diffObjects(
    local.devDependencies,
    published.devDependencies,
  );

  if (!depsDiff.hasChanges && !devDepsDiff.hasChanges) {
    return;
  }

  for (const key of ["added", "removed"]) {
    if (depsDiff[key].length) {
      console.info(chalk.yellow(` * Dependencies ${key}:`));
      console.info("  - " + depsDiff[key].join(", "));
    }
    if (devDepsDiff[key].length) {
      console.info(chalk.yellow(` * Dev dependencies ${key}:`));
      console.info("  - " + devDepsDiff[key].join(", "));
    }
  }

  if (depsDiff.changed.length) {
    console.info(chalk.yellow(" * Dependencies changed:"));
    for (const key of depsDiff.changed) {
      const publishedVersion = published.dependencies[key];
      const localVersion = local.dependencies[key];
      console.info(`  - ${key}: ${publishedVersion} -> ${localVersion}`);
    }
  }

  if (devDepsDiff.changed.length) {
    console.info(chalk.yellow(" * Devloper dependencies changed:"));
    for (const key of devDepsDiff.changed) {
      const publishedVersion = published.devDependencies[key];
      const localVersion = local.devDependencies[key];
      console.info(`  - ${key}: ${publishedVersion} -> ${localVersion}`);
    }
  }
  console.info();
}

for (const pkg of packages) {
  await checkPackage(pkg);
}
