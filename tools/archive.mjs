#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";

function extractVersionFromFileName(fileName) {
  const regex = /-v(\d+\.\d+\.\d+)\.kpz/;
  const match = fileName.match(regex);
  return match ? match[1] : null;
}

function moveFilesToArchive(pattern, archiveDir, version) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "");
  fs.readdirSync(".")
    .filter((file) => file.match(pattern))
    .forEach((file) => {
      const sourcePath = path.join(".", file);
      const destinationPath = path.join(archiveDir, `${timestamp}_${file}`);
      const fileVersion = extractVersionFromFileName(file);

      if (fileVersion && compareVersions(fileVersion, version) < 0) {
        fs.renameSync(sourcePath, destinationPath);
        console.info(chalk.cyanBright(`moved ${file} to ${destinationPath}`));
      }
    });
}

function compareVersions(versionA, versionB) {
  const partsA = versionA.split(".");
  const partsB = versionB.split(".");

  for (let i = 0; i < 3; i++) {
    const numberA = parseInt(partsA[i], 10);
    const numberB = parseInt(partsB[i], 10);

    if (numberA > numberB) {
      return 1;
    } else if (numberA < numberB) {
      return -1;
    }
  }

  return 0;
}

function main() {
  const file = "package.json";

  const json = jsonfile.readFileSync(file);
  const { version } = json;

  const archiveDir = "archive";
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir);
  }

  const pattern = /-v(\d+\.\d+\.\d+)\.kpz/;
  moveFilesToArchive(pattern, archiveDir, version);
}

main();
