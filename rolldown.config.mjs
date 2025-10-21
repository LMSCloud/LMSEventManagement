import { defineConfig } from "rolldown";
import typescript from "@rollup/plugin-typescript";
import minifyHTML from "rollup-plugin-html-literals";

export default defineConfig([
  // Staff bundle - staff interface components
  {
    input: "./src/staff.ts",
    output: {
      dir: "./Koha/Plugin/Com/LMSCloud/EventManagement/dist/",
      entryFileNames: "staff.js",
      format: "esm",
      sourcemap: true,
      minify: true,
    },
    platform: "browser",
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      typescript({
        sourceMap: false,
        inlineSources: false,
      }),
      minifyHTML(),
    ],
  },
  // OPAC bundle - public events listing page
  {
    input: "./src/opac.ts",
    output: {
      dir: "./Koha/Plugin/Com/LMSCloud/EventManagement/dist/",
      entryFileNames: "opac.js",
      format: "esm",
      sourcemap: true,
      minify: true,
    },
    platform: "browser",
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      typescript({
        sourceMap: false,
        inlineSources: false,
      }),
      minifyHTML(),
    ],
  },
  // OPAC widget bundle - minimal bundle for OPAC homepage widget
  {
    input: "./src/opac-widget.ts",
    output: {
      dir: "./Koha/Plugin/Com/LMSCloud/EventManagement/dist/",
      entryFileNames: "opac-widget.js",
      format: "esm",
      sourcemap: true,
      minify: true,
    },
    platform: "browser",
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      typescript({
        sourceMap: false,
        inlineSources: false,
      }),
      minifyHTML(),
    ],
  },
]);
