#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { performance } from "perf_hooks";

async function get_excluded_dirs(dir_path) {
  const ignore_file_path = path.join(dir_path, ".kohaignore");
  const excluded_dirs = [];

  try {
    const ignore_file = await fs.readFile(ignore_file_path, "utf8");
    const lines = ignore_file.split("\n");

    for (const line of lines) {
      if (line.startsWith("#")) continue;
      if (line.trim() === "") continue;

      excluded_dirs.push(line);
    }

    return excluded_dirs;
  } catch (err) {
    if (err.code === "ENOENT") {
      return excluded_dirs;
    }
    throw err;
  }
}

async function recursive_dir_search({
  dir_path,
  callback,
  excluded_dirs,
  find_all = false,
}) {
  const items = await fs.readdir(dir_path, { withFileTypes: true });

  let results = [];

  const siblings = items.filter((item) => item.isFile());
  if (siblings.length) {
    for (const sibling of siblings) {
      const result = await callback(dir_path, sibling.name);
      if (result) {
        if (find_all) {
          results.push(result);
        } else {
          return result;
        }
      }
    }
  }

  for (const item of items) {
    if ((item.isDirectory() && excluded_dirs?.includes(item.name)) ?? false)
      continue;

    if (item.isDirectory()) {
      const subdir_path = path.join(dir_path, item.name);
      const result = await callback(subdir_path, item.name);

      if (result) {
        if (find_all) {
          results.push(result);
        } else {
          return result;
        }
      } else {
        const subdir_result = await recursive_dir_search({
          dir_path: subdir_path,
          callback,
          excluded_dirs,
          find_all,
        });

        if (subdir_result) {
          if (find_all) {
            results = results.concat(subdir_result);
          } else {
            return subdir_result;
          }
        }
      }
    }
  }

  return find_all ? results : undefined;
}

async function find_koha_dir(root_path, excluded_dirs) {
  return recursive_dir_search({
    dir_path: root_path,
    callback: (subdir_path, item_name) => {
      if (item_name === "Koha") {
        return `${root_path}/${subdir_path}`;
      }
      return undefined;
    },
    excluded_dirs,
  });
}

async function find_plugin_path(dir_path) {
  return recursive_dir_search({
    dir_path,
    callback: (subdir_path, item_name) => {
      if (item_name.endsWith(".pm")) {
        return { pm_file_name: item_name, pm_file_path: subdir_path };
      }
      return undefined;
    },
  });
}

async function get_plugin_object(search_path) {
  const startTime = performance.now();

  console.info(chalk.blue("Searching for plugin object..."));

  const root_path = search_path ?? ".";
  const excluded_dirs = await get_excluded_dirs(root_path);

  const koha_path = await find_koha_dir(root_path, excluded_dirs);
  if (!koha_path) {
    throw new Error("Koha directory not found in the project root");
  }

  console.info(
    chalk.green("Koha directory found at:"),
    chalk.yellow(koha_path)
  );

  const plugin_path = await find_plugin_path(koha_path);
  if (!plugin_path) {
    throw new Error("No .pm file found");
  }

  console.info(
    chalk.green(".pm file found:"),
    chalk.yellow(plugin_path.pm_file_name)
  );

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  console.info(chalk.blue(`Execution time: ${duration} ms`));

  return {
    pm: {
      file: {
        name: plugin_path.pm_file_name,
        path: plugin_path.pm_file_path,
      },
    },
  };
}

export { get_plugin_object, recursive_dir_search };
