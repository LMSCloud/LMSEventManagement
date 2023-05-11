import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import analyze from "rollup-plugin-analyzer";
import path from "path";

export default {
  input: "./src/main.ts",
  output: {
    dir: "./Koha/Plugin/Com/LMSCloud/EventManagement/dist/",
    format: "umd",
    name: "EventManagementBundle",
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    postcss({
      plugins: [
        autoprefixer({
          overrideBrowserslist: ["last 2 versions", "ie >= 11"],
        }),
      ],
      extract: path.resolve(
        "Koha/Plugin/Com/LMSCloud/EventManagement/dist/main.css"
      ),
      minimize: true,
      sourceMap: true,
    }),
    typescript({
      declaration: false,
      declarationMap: false,
    }),
    // minifyHTML(),
    // terser(),
    // analyze({
    //   summaryOnly: true,
    // }),
  ],
};
