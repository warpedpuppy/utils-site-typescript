// Regenerate public/sitemap.xml from the animation registry, so every visible
// /examples/:slug page (each of which sets its own <title> + canonical) is
// discoverable. Run from the repo root:
//
//   npx vite-node scripts/generate-sitemap.ts
//
// registry.test.ts ("A7") asserts the committed sitemap matches this exact
// output, so editing the registry fails the suite until this is re-run.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ALL_RECORDS } from "../src/registry";
import { buildSitemapXml } from "./sitemap";

const outPath = resolve(process.cwd(), "public/sitemap.xml");
writeFileSync(outPath, buildSitemapXml(ALL_RECORDS));
console.log(`wrote ${outPath}`);
