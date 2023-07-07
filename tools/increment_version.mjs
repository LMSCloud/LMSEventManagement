#!/usr/bin/env node

import jsonfile from "jsonfile";
import chalk from "chalk";

const file = "package.json";

const json = jsonfile.readFileSync(file);

console.info(
  chalk.cyan(`Version: ${json.version}`),
  chalk.cyan(`Previous Version: ${json.previous_version}`)
);

const { version } = json;
const version_parts = version.split(".");
const major = parseInt(version_parts[0], 10);
const minor = parseInt(version_parts[1], 10);
let patch = parseInt(version_parts[2], 10);

let prev_major = parseInt(version_parts[0], 10);
let prev_minor = parseInt(version_parts[1], 10);

let new_version;

// No version jumps, just increment patch version
if (major === prev_major && minor === prev_minor) {
  prev_major = major;
  prev_minor = minor;

  patch += 1;

  new_version = `${major}.${minor}.${patch}`;
} else {
  // Version jumped, don't increment patch
  new_version = version;
}

json.previous_version = version;
json.version = new_version;

jsonfile.writeFile(file, json, { spaces: 2 }, (err) => {
  if (err) console.error(chalk.red(`ERROR: ${err}`));
});

console.info(
  chalk.green(`New Version: ${json.version}`),
  chalk.green(`New Previous Version: ${json.previous_version}`)
);
