#!/usr/bin/env node

/* 
Copyright 2023 Mark James Howard and Paul Derscheid

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHORS DISCLAIM ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE. 
*/

import fs from "fs";
import { Command } from "commander";
import { resolve } from "path";
import { createLogger, format, transports } from "winston";
import chalk from "chalk";
import { execSync } from "child_process";

// Create a logger instance
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      const coloredLevel = level === "error" ? chalk.red(level) : level;
      return `${timestamp} [${coloredLevel.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "script.log" }),
  ],
});

const program = new Command();

program
  .name("./generate_tw_css_result.mjs")
  .description(
    `Generates a Tailwind CSS file and wraps it in a Lit template literal.
    \rThis tool expects a tailwind.config.{js,json} file to exist in the current working directory.
    \rThis is not a wrapper for the Tailwind CLI, but rather a tool to generate a CSS file that can 
    \rbe imported into a Lit component. The generated CSS file will always be named "tailwind.lit.js" but
    \rthe output directory can be specified with the -o option.`
  )
  .usage("[options]")
  .option("-o, --output <dir>", "output dir")
  .option(
    "-c, --config <file>",
    "Tailwind CSS config file",
    "./tailwind.config.js"
  )
  .option("-w, --watch", "Enable file watching")
  .parse(process.argv);

const options = program.opts();
const outputPath = resolve(process.cwd(), options.output) + "/tailwind.lit.js";
const configPath = options.config
  ? resolve(process.cwd(), options.config)
  : undefined;

// Validate config file existence
if (!configPath && !fs.existsSync("./tailwind.config.js")) {
  logger.error(
    "Config file not found. Please specify a config file with the -c option."
  );
  process.exit(1);
}

if (configPath && !fs.existsSync(configPath)) {
  logger.error(`Config file not found: ${configPath}`);
  process.exit(1);
}

let inputPath = options.input;
if (!inputPath) {
  if (configPath && fs.existsSync(configPath)) {
    const { files } = await loadConfigFile(configPath);
    inputPath = files;
  }
}

logger.info(chalk.yellow(`Reading from file(s) ${inputPath}`));

// Generate Tailwind CSS
try {
  let tailwindCommand = "npx tailwindcss";

  tailwindCommand += ` -c ${configPath}`;
  logger.info(chalk.yellow(`Using config file: ${configPath}`));
  logger.info(chalk.yellow(`Using output file: ${outputPath}`));

  // Execute the tailwindcss command with the specified input
  let tailwindCSS = undefined;
  try {
    // Before we execute the command, we need to delete the tailwind.d.ts file
    // so it doesn't cause an error when executing tailwindcss with the postcss-lit plugin.
    const declarationFilePath = outputPath.replace(".js", ".d.ts");
    if (fs.existsSync(declarationFilePath)) {
      fs.unlinkSync(declarationFilePath);
    }

    logger.info(chalk.yellow(`Executing command: ${tailwindCommand}`));
    const execOptions = {
      stdio: ["inherit", "pipe", "pipe"],
      encoding: "utf8",
    };
    tailwindCSS = execSync(`${tailwindCommand}`, execOptions);
  } catch (error) {
    const errorMessage = error?.stderr?.toString().trim() || error.message;
    throw new Error(errorMessage);
  }

  logger.info(chalk.green("Tailwind CSS generated successfully!"));

  // Wrap the generated CSS in a template literal
  let cleanContents;

  // Replace backticks inside the CSSResult
  cleanContents = tailwindCSS.replace(/`/g, "");
  
  const litContents = `
    import { css } from "lit";
    export const tailwindStyles = css\`${cleanContents}\`;
  `;
  fs.writeFileSync(outputPath, litContents.trim());

  // Here we are also outputting a TS declaration file for the CSSResult.
  const tsDeclaration = `
    import { CSSResult } from "lit";
    export const tailwindStyles: CSSResult;
  `;
  const declarationFilePath = outputPath.replace(".js", ".d.ts");

  if (!fs.existsSync(declarationFilePath)) {
    fs.writeFileSync(declarationFilePath, tsDeclaration.trim());
  }

  logger.info(chalk.green(`Updated output file at ${outputPath}`));
} catch (error) {
  logger.error(chalk.red(`Failed to generate Tailwind CSS: ${error}`));
  process.exit(1);
}

if (options.watch) {
  let isWatching = false;
  let timerId = null;

  function processFileChange() {
    try {
      logger.info(chalk.yellow("Processing file change..."));
      const contents = fs.readFileSync(outputPath, "utf8");

      let cleanContents = contents.replace(/`/g, "");
      cleanContents = cleanContents.replace(/\\/g, "\\\\");

      const litContents = `
        import { css } from "lit";
        export const tailwindStyles = css\`${cleanContents}\`;
      `;

      fs.writeFileSync(outputPath, litContents);
      logger.info(chalk.green(`Updated output file at ${outputPath}`));
    } catch (error) {
      logger.error(chalk.red("Failed to process file change:"), error.message);
    }
  }

  function startFileWatch() {
    if (isWatching) {
      return;
    }

    isWatching = true;

    // Watch for file changes
    fs.watch(outputPath, { encoding: "utf8" }, (eventType, filename) => {
      logger.info(chalk.yellow(`File "${filename}" changed. Reloading...`));

      // Delay processing to avoid multiple rapid changes triggering concurrently
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        processFileChange();
      }, 200); // Throttle file change events to a minimum interval of 200ms
    });

    logger.info(chalk.yellow(`Started watching file: ${outputPath}`));
  }

  startFileWatch();
}

async function loadConfigFile(configPath) {
  const fileType = configPath.split(".").pop();
  if (fileType === "js") {
    const config = await import(configPath);
    if (config?.default?.content) {
      return config.default.content;
    } else {
      logger.error(
        "Config file must export a 'content' property when using a js file."
      );
      process.exit(1);
    }
  } else if (fileType === "json") {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (config.content) {
      return config.content;
    } else {
      logger.error(
        "Config file must contain a 'content' property when using a json file."
      );
      process.exit(1);
    }
  } else if (fileType === "yaml" || fileType === "yml") {
    const jsYaml = await import("js-yaml");
    const config = jsYaml.load(fs.readFileSync(configPath, "utf8"));
    if (config.content) {
      return config.content;
    } else {
      logger.error(
        "Config file must contain a 'content' property when using a yaml file."
      );
      process.exit(1);
    }
  } else {
    logger.error(
      "Config file must be a js, json, yaml, or yml file when not specifying an input path."
    );
    process.exit(1);
  }
}
