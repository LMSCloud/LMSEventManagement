import { defineConfig } from "rolldown";
import typescript from "@rollup/plugin-typescript";
import minifyHTML from "rollup-plugin-html-literals";

export default defineConfig([
  // Main bundle - comprehensive UMD bundle for backward compatibility
  {
    input: "./src/main.ts",
    output: {
      dir: "./Koha/Plugin/Com/LMSCloud/EventManagement/dist/",
      entryFileNames: "main.js",
      format: "umd",
      name: "EventManagementBundle",
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
