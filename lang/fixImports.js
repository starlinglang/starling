import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const originalImports = `import almostnode from "https://cdn.jsdelivr.net/npm/almostnode@0.2.14/+esm";
import checkmm from "https://unpkg.com/checkmm@1.1.1/dist/checkmm.js";
import { grammar as $2iNG1$grammar } from "https://cdn.skypack.dev/ohm-js";
import { toAST as $2iNG1$toAST } from "https://cdn.skypack.dev/ohm-js/extras";`;

// Replace with whatever your output file is
const outputFile = path.join(__dirname, "../ide", "lang.mjs");

let content = fs.readFileSync(outputFile, "utf-8");
const lines = content.split("\n");

// Find where the imports end
let lastImportIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith("import ") || lines[i].startsWith("export ")) {
    lastImportIndex = i;
  } else if (lastImportIndex !== -1) {
    break;
  }
}

// Replace old imports with new ones
if (lastImportIndex !== -1) {
  const remaining = lines.slice(lastImportIndex + 1);
  const newContent = originalImports + "\n" + remaining.join("\n");
  fs.writeFileSync(outputFile, newContent);
  console.log("✓ Fixed imports in", outputFile);
}
