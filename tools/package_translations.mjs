#!/usr/bin/env node

import po2json from "po2json";
import fs from "fs/promises";
import chalk from "chalk";
import { performance } from "perf_hooks";

async function move(file, options) {
  const [locale] = file.split(".");
  const source = `locales/${file}`;
  const destination = `${options.pm.file.path}/${options.pm.file.name.replace(
    ".pm",
    ""
  )}/locales/${locale}/LC_MESSAGES`;

  try {
    await fs.mkdir(destination, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw new Error(chalk.red(`Error creating directory: ${err.message}`));
    }
  }

  const start = performance.now();
  await fs.copyFile(source, `${destination}/${options.locale_namespace}.mo`);
  const end = performance.now();
  console.info(
    chalk.green("Moved .mo file to the correct location:"),
    chalk.cyan(source),
    chalk.green("→"),
    chalk.cyan(destination),
    chalk.dim(`(${(end - start).toFixed(2)}ms)`)
  );
}

async function convert(file, options) {
  const [locale] = file.split(".");
  const locales_path = `${options.pm.file.path}/${options.pm.file.name.replace(
    ".pm",
    ""
  )}/locales/${locale}/LC_MESSAGES`;

  try {
    await fs.mkdir(locales_path, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw new Error(chalk.red(`Error creating directory: ${err.message}`));
    }
  }

  const json_file = `${locales_path}/${locale}.json`;
  const start = performance.now();
  const data = await new Promise((resolve, reject) => {
    po2json.parseFile(`locales/${file}`, { format: "mf" }, (err, data) => {
      if (err)
        reject(new Error(chalk.red(`Error parsing file: ${err.message}`)));
      else resolve(data);
    });
  });

  data[""] = {
    language: locale,
    "plural-forms": "nplurals=2; plural=n>1",
  };

  await fs.writeFile(json_file, JSON.stringify(data));

  const end = performance.now();
  console.info(
    chalk.green("Converted .po file to .json:"),
    chalk.cyan(`locales/${file}`),
    chalk.green("→"),
    chalk.cyan(json_file),
    chalk.dim(`(${(end - start).toFixed(2)}ms)`)
  );
}

async function main() {
  const options = {
    locale_namespace: "com.lmscloud.eventmanagement",
    pm: {
      file: { name: "EventManagement.pm", path: "Koha/Plugin/Com/LMSCloud" },
    },
  };

  const start = performance.now();

  try {
    const files = await fs.readdir("locales");

    console.info(
      chalk.magentaBright.bold(
        "Moving .mo files to the correct location and converting .po files to .json:"
      ),
      chalk.yellowBright(`[ ${files.join(", ")} ]`)
    );

    if (!files.length) {
      console.info(chalk.whiteBright('No files found in "locales" folder.'));
      return;
    }

    const tasks = files.map((file) => {
      const [, type] = file.split(".");

      if (type === "mo") {
        return move(file, options);
      }

      if (type === "po") {
        return convert(file, options);
      }

      return undefined;
    });

    await Promise.all(tasks);

    const end = performance.now();
    console.info(
      chalk.greenBright.bold("Script execution completed in:"),
      chalk.whiteBright.bold(`${(end - start).toFixed(2)}ms`)
    );
  } catch (err) {
    console.error(chalk.redBright.bold("Error:"), chalk.redBright(err.message));
  }
}

main();
