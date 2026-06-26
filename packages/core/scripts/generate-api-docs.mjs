#!/usr/bin/env node
// Regenerates src/pages/api/core-api.json — the data the API page's
// "Documentation" tab renders. One entry per public @utilspalooza/core export,
// pulled straight from JSDoc + types by extract-api.mjs.
//
// Run from the package: `npm run docs`  (also part of `npm run build`).
//
// The Documentation tab and the api-docs-complete.test.ts both read from this
// extractor, so the page can never silently drift behind the real exports:
// add a function without docs and the test goes red.

import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractApi, SRC_DIR } from "./extract-api.mjs";

const outPath = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "..",
  "..",
  "src",
  "pages",
  "api",
  "core-api.json"
);

const entries = extractApi(SRC_DIR);
const json = JSON.stringify(entries, null, 2) + "\n";

const previous = (() => {
  try {
    return readFileSync(outPath, "utf8");
  } catch {
    return "";
  }
})();

if (previous === json) {
  console.log(`docs: core-api.json already up to date (${entries.length} exports).`);
} else {
  writeFileSync(outPath, json);
  console.log(`docs: wrote core-api.json (${entries.length} exports).`);
}
