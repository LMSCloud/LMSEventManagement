/* eslint-disable no-console */
const jsonfile = require('jsonfile');

const file = 'package.json';

const json = jsonfile.readFileSync(file);

console.log(`Version: ${json.version}`);
console.log(`Previous Version: ${json.previous_version}`);

const { version } = json;
const versionParts = version.split('.');
const major = parseInt(versionParts[0], 10);
const minor = parseInt(versionParts[1], 10);
let patch = parseInt(versionParts[2], 10);

// const prevVersion = json.previous_version;
// const prevVersionParts = prevVersion.split('.');
let prevMajor = parseInt(versionParts[0], 10);
let prevMinor = parseInt(versionParts[1], 10);
// const prevPatch = parseInt(versionParts[2], 10);

let newVersion;

// No version jumps, just increment patch version
if (major === prevMajor && minor === prevMinor) {
  prevMajor = major;
  prevMinor = minor;
  // prevPatch = patch;

  patch += 1;

  newVersion = `${major}.${minor}.${patch}`;
} else { // Version jumped, don't increment patch
  newVersion = version;
}

json.previous_version = version;
json.version = newVersion;

jsonfile.writeFile(file, json, { spaces: 2 }, (err) => {
  if (err) console.error(`ERROR: ${err}`);
});

console.log(`New Version: ${json.version}`);
console.log(`New Previous Version: ${json.previous_version}`);
