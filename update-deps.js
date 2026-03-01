/*
 * This script updates all dependencies in all packages to their latest versions.
 * Usage: node update-deps.js
 */

import fs from "fs/promises";
import { promisify } from "util";
import packageJson from "pkg.json";
import chalk from "chalk";

const pkgJson = promisify(packageJson);

const packages = [
  "eslint-config",
  "dev-deps",
  "dev-deps-node",
  "dev-deps-react",
];

const loadJsonFile = async (path) => {
  const contents = await fs.readFile(path, "utf8");
  return JSON.parse(contents);
};

const saveJsonFile = async (path, data) => {
  await fs.writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
};

async function getLatestVersion(pkgName) {
  try {
    const info = await pkgJson(pkgName, "latest");
    return info.version;
  } catch (error) {
    console.warn(
      chalk.yellow(`  ⚠ Could not fetch latest version for ${pkgName}`),
    );
    return null;
  }
}

async function updateDependencies(deps) {
  if (!deps) return null;

  const updated = { ...deps };
  let changedCount = 0;

  for (const [name, currentVersion] of Object.entries(deps)) {
    const latestVersion = await getLatestVersion(name);
    if (latestVersion && `^${latestVersion}` !== currentVersion) {
      updated[name] = `^${latestVersion}`;
      console.info(
        chalk.cyan(`  ✓ ${name}: ${currentVersion} → ^${latestVersion}`),
      );
      changedCount++;
    }
  }

  return { updated, changedCount };
}

async function updatePackage(pkg) {
  console.info(`\n${chalk.green.bold(pkg)}`);
  const path = `${pkg}/package.json`;
  const local = await loadJsonFile(path);

  let totalChanges = 0;

  if (local.dependencies && Object.keys(local.dependencies).length > 0) {
    console.info(chalk.yellow("  Dependencies:"));
    const { updated, changedCount } = await updateDependencies(
      local.dependencies,
    );
    local.dependencies = updated;
    totalChanges += changedCount;
  }

  if (local.devDependencies && Object.keys(local.devDependencies).length > 0) {
    console.info(chalk.yellow("  Dev dependencies:"));
    const { updated, changedCount } = await updateDependencies(
      local.devDependencies,
    );
    local.devDependencies = updated;
    totalChanges += changedCount;
  }

  if (totalChanges > 0) {
    await saveJsonFile(path, local);
    console.info(chalk.green(`  ✅ Updated ${totalChanges} dependencies`));
  } else {
    console.info(chalk.gray("  ℹ No updates needed"));
  }
}

console.info(chalk.bold("Updating all dependencies to latest versions...\n"));

for (const pkg of packages) {
  await updatePackage(pkg);
}

console.info(chalk.green.bold("\n✅ Done!"));
