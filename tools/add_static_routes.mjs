#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import {
  get_plugin_object,
  recursive_dir_search,
} from "./get_plugin_object.mjs";

function create_path_spec_object() {
  return {
    get: {
      "x-mojo-to": "Static#get",
      tags: ["pluginStatic"],
      responses: {
        200: {
          description: "File found",
          schema: {
            type: "file",
          },
        },
        400: {
          description: "Bad request",
          schema: {
            type: "object",
            properties: {
              error: {
                description: "An explanation for the error",
                type: "string",
              },
            },
          },
        },
        404: {
          description: "File not found",
          schema: {
            type: "object",
            properties: {
              error: {
                description: "An explanation for the error",
                type: "string",
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          schema: {
            type: "object",
            properties: {
              error: {
                description: "An explanation for the error",
                type: "string",
              },
            },
          },
        },
      },
    },
  };
}

async function directory_exists(dir_path) {
  try {
    const stats = await fs.stat(dir_path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

async function main() {
  const plugin_object = await get_plugin_object(".");
  const { pm } = plugin_object;
  const plugin_dirname = pm.file.name.replace(".pm", "");
  const plugin_content_path = `${pm.file.path}/${plugin_dirname}`;
  const staticapi_file = `${plugin_content_path}/staticapi.json`;

  const locales_path = `${plugin_content_path}/locales`;
  const static_dir = `${plugin_content_path}/static`;
  const dist_dir = `${plugin_content_path}/dist`;

  let path_specs = {};

  try {
    // Add path specs for <LOCALE>.json files
    if (await directory_exists(locales_path)) {
      console.info(chalk.cyan(`Processing ${locales_path} directory...`));
      const locale_files = await recursive_dir_search({
        dir_path: locales_path,
        callback: (subdir_path, item_name) => {
          if (item_name.endsWith(".json")) {
            return { name: item_name, dir_path: subdir_path };
          }
          return undefined;
        },
        find_all: true,
      });

      for (const file of locale_files) {
        const { name, dir_path } = file;
        const locale = path.basename(name, ".json");
        path_specs[
          `${dir_path.replace(plugin_content_path, "")}/${locale}.json`
        ] = create_path_spec_object();
      }
    }

    // Add path specs for files in the static directory
    if (await directory_exists(static_dir)) {
      console.info(chalk.cyan(`Processing ${static_dir} directory...`));
      const static_files = await fs.readdir(static_dir);
      for (const file of static_files) {
        path_specs[`/static/${file}`] = create_path_spec_object();
      }
    }

    // Add path specs for js, js.map, css, and css.map files in the dist directory
    if (await directory_exists(dist_dir)) {
      console.info(chalk.cyan(`Processing ${dist_dir} directory...`));
      const dist_files = await fs.readdir(dist_dir);
      for (const file of dist_files) {
        if (
          file.endsWith(".js") ||
          file.endsWith(".js.map") ||
          file.endsWith(".css") ||
          file.endsWith(".css.map")
        ) {
          path_specs[`/dist/${file}`] = create_path_spec_object();
        }
      }
    }

    // Write path specs to staticapi.json
    await fs.writeFile(staticapi_file, JSON.stringify(path_specs, null, 2));
    console.info(
      `Routes for static files have been added to ${staticapi_file}.`
    );
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
  }
}

main();
