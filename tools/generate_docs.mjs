#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import showdown from "showdown";
import chalk from "chalk";
import * as htmlparser2 from "htmlparser2";
import he from "he";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const converter = new showdown.Converter();

const baseDir = path.resolve(__dirname, "..");
const docsDir = path.resolve(baseDir, "docs");
const outputDir = path.resolve(baseDir, "src/docs");
const translationsImportPath = "../lib/translate";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const markdownFiles = fs
  .readdirSync(docsDir)
  .filter((file) => file.endsWith(".md"));

markdownFiles.forEach((markdownFile) => {
  const markdownPath = path.join(docsDir, markdownFile);
  const markdownContent = fs.readFileSync(markdownPath, "utf-8");

  const htmlContent = converter.makeHtml(markdownContent);
  const parsedContent = parseHTML(htmlContent);
  const variableName = path
    .basename(markdownFile, ".md")
    .replace(/[^a-zA-Z0-9_]/g, "_");
  const outputFilePath = path.join(outputDir, `${variableName}.ts`);
  const outputContent = `
    import { html } from 'lit';
    import { __ } from '${translationsImportPath}';
    
    export const ${variableName} = html\`${parsedContent}\`;
  `;

  fs.writeFileSync(outputFilePath, outputContent, "utf-8");

  console.info(chalk.green(`Generated ${outputFilePath}`));
});

console.info(chalk.green("Documentation generated successfully!"));

function parseHTML(html) {
  let parsedContent = "";
  let withinCodeTag = false;

  const parser = new htmlparser2.Parser(
    {
      onopentag(name) {
        parsedContent += `<${name}>`;
        if (name === "code") {
          withinCodeTag = true;
        }
      },
      ontext(text) {
        if (withinCodeTag) {
          parsedContent += he.encode(text);
        } else {
          let textNode = "";
          if (text === " ") {
            textNode = "&nbsp;";
          } else if (text === "\n") {
            textNode = "";
          } else {
            textNode = `\${__("${text.replace(/"/g, '\\"')}")}`;
          }
          parsedContent += textNode;
        }
      },
      onclosetag(name) {
        parsedContent += `</${name}>`;
        if (name === "code") {
          withinCodeTag = false;
        }
      },
      oncomment(data) {
        parsedContent += `<!--${data}-->`;
      },
      onprocessinginstruction(name, data) {
        parsedContent += `<?${name} ${data}?>`;
      },
    },
    { decodeEntities: true }
  );

  parser.write(html);
  parser.end();

  return parsedContent;
}
