// Build-time Copy Code export-catalog generator (Work Package 3 of the
// 2026-07-11 code review remediation). Replaces the animation-grained
// manifest walk + regex stripTypeScript() pipeline with a function-grained
// catalog whose TypeScript AND JavaScript snippets are produced by the
// TypeScript compiler at build time (the compiler never ships to the browser).
//
// For every value export in src/pages/api/core-api.json that is not excluded
// (scripts/export-catalog-exclusions.mjs) this script:
//   1. parses the canonical source `packages/core/src/<module>.ts`,
//   2. extracts the single exported declaration via the shared AST helpers,
//   3. prints tsSource (export modifier stripped) and transpiles jsSource,
//   4. computes dependencyKeys: catalog keys the declaration's body actually
//      references (identifier scan minus locally declared/shadowed names),
//   5. records interfaceNames: site InterfaceMap type names referenced in the
//      declaration's signature/body,
//   6. writes the deterministic generated module
//      src/pages/createJSON/exportCatalogData.ts (keys sorted alphabetically).
//
// Run:  node scripts/generate-export-catalog.mjs
// A drift test compares fresh generateExportCatalog() output with the
// committed module.

import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EXPORT_CATALOG_EXCLUSIONS } from "./export-catalog-exclusions.mjs";
import {
  findExportedDeclaration,
  parseSource,
  printDeclaration,
  transpileDeclaration,
} from "./ts-extract.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CORE_API_PATH = join(REPO_ROOT, "src/pages/api/core-api.json");
const GENERATED_MODULE_PATH = join(
  REPO_ROOT,
  "src/pages/createJSON/exportCatalogData.ts"
);

// The shared site interfaces (src/types/shapes InterfaceMap / INTERFACE_ORDER).
// A catalog entry referencing one of these gets it emitted in the TS output.
const SITE_INTERFACE_NAMES = new Set([
  "Point",
  "Vector",
  "ShapeInMotion",
  "Circle",
  "Container",
  "Line",
  "Triangle",
  "Polygon",
  "Rectangle",
  "Ball",
]);

const TYPE_ONLY_REASON =
  "Type-only export — no runtime snippet; shared shapes ship in the " +
  "TypeScript output's interface block instead.";

function collectLocalNames(declaration) {
  // Names declared inside the extracted declaration (params, locals, nested
  // functions) — references to these must not count as catalog dependencies.
  const locals = new Set();
  const visit = (node) => {
    if (
      (ts.isVariableDeclaration(node) ||
        ts.isParameter(node) ||
        ts.isBindingElement(node)) &&
      ts.isIdentifier(node.name)
    ) {
      locals.add(node.name.text);
    }
    if (
      (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
      node.name
    ) {
      locals.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(declaration);
  return locals;
}

function collectReferencedNames(declaration) {
  const referenced = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const parent = node.parent;
      // Skip identifiers that are property NAMES, not value references.
      const isPropertyName =
        (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
        (ts.isPropertyAssignment(parent) && parent.name === node) ||
        (ts.isPropertySignature(parent) && parent.name === node) ||
        (ts.isMethodDeclaration(parent) && parent.name === node);
      if (!isPropertyName) referenced.add(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(declaration);
  return referenced;
}

function collectTypeReferenceNames(declaration) {
  const names = new Set();
  const visit = (node) => {
    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      names.add(node.typeName.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(declaration);
  return names;
}

/**
 * Pure generation pass. Returns { entries, excluded }:
 *   entries  — { key, module, tsSource, jsSource, dependencyKeys,
 *                interfaceNames }[] sorted by key
 *   excluded — { name: reason } for every core-api export with no entry
 */
export function generateExportCatalog() {
  const coreApi = JSON.parse(readFileSync(CORE_API_PATH, "utf8"));

  const excluded = {};
  const included = [];
  for (const entry of coreApi) {
    if (entry.kind === "type") {
      excluded[entry.name] = TYPE_ONLY_REASON;
    } else if (entry.name in EXPORT_CATALOG_EXCLUSIONS) {
      excluded[entry.name] = EXPORT_CATALOG_EXCLUSIONS[entry.name];
    } else {
      included.push(entry);
    }
  }
  for (const name of Object.keys(EXPORT_CATALOG_EXCLUSIONS)) {
    if (!coreApi.some((e) => e.name === name)) {
      throw new Error(
        `Exclusion "${name}" does not match any core-api.json export.`
      );
    }
  }

  const includedKeys = new Set(included.map((e) => e.name));
  const typeOnlyNames = new Set(
    coreApi.filter((e) => e.kind === "type").map((e) => e.name)
  );
  const results = new Map();

  for (const apiEntry of included) {
    const { name, module } = apiEntry;
    if (results.has(name)) {
      throw new Error(`Duplicate core-api export name "${name}".`);
    }
    const sourceFile = `packages/core/src/${module}.ts`;
    const sourceText = readFileSync(join(REPO_ROOT, sourceFile), "utf8");
    const parsed = parseSource(sourceFile, sourceText);
    const declaration = findExportedDeclaration(parsed, name, sourceFile);

    const tsSource = printDeclaration(declaration, parsed);
    const jsSource = transpileDeclaration(tsSource, sourceFile);
    if (!jsSource.includes(name)) {
      throw new Error(
        `Transpiled source for "${name}" lost its identifier — refusing to ` +
          `emit an uncallable declaration.`
      );
    }

    const locals = collectLocalNames(declaration);
    const referenced = collectReferencedNames(declaration);
    const dependencyKeys = [...includedKeys]
      .filter((k) => k !== name && referenced.has(k) && !locals.has(k))
      .sort();

    for (const ref of referenced) {
      // Type-only references are fine: they vanish in the JS output and the
      // TS output's parse-level contract doesn't require them declared.
      if (
        ref !== name &&
        ref in excluded &&
        !typeOnlyNames.has(ref) &&
        !locals.has(ref)
      ) {
        throw new Error(
          `"${name}" references excluded export "${ref}" — either include ` +
            `"${ref}" in the catalog or exclude "${name}" too.`
        );
      }
    }

    const interfaceNames = [...collectTypeReferenceNames(declaration)]
      .filter((t) => SITE_INTERFACE_NAMES.has(t))
      .sort();

    results.set(name, {
      key: name,
      module,
      tsSource,
      jsSource,
      dependencyKeys,
      interfaceNames,
    });
  }

  return {
    entries: [...results.values()].sort((a, b) => (a.key < b.key ? -1 : 1)),
    excluded: Object.fromEntries(
      Object.entries(excluded).sort(([a], [b]) => (a < b ? -1 : 1))
    ),
  };
}

export function renderGeneratedModule(catalog) {
  const lines = [
    "// AUTO-GENERATED by scripts/generate-export-catalog.mjs — DO NOT EDIT.",
    "// Regenerate with:  node scripts/generate-export-catalog.mjs",
    "//",
    "// Function-grained Copy Code catalog data: for every copyable",
    "// @utilspalooza/core export, its canonical TypeScript snippet and the",
    "// TypeScript-compiler-transpiled JavaScript snippet, plus the catalog",
    "// keys it depends on and the shared interfaces it references. Generated",
    "// at build time so the TypeScript compiler never ships to the browser",
    "// and production minification cannot corrupt the snippets.",
    "",
    "export interface ExportCatalogDataEntry {",
    "  key: string;",
    "  module: string;",
    "  tsSource: string;",
    "  jsSource: string;",
    "  dependencyKeys: string[];",
    "  interfaceNames: string[];",
    "}",
    "",
    "export const EXPORT_CATALOG_DATA: ExportCatalogDataEntry[] = [",
  ];
  for (const entry of catalog.entries) {
    lines.push(`  ${JSON.stringify(entry)},`);
  }
  lines.push(
    "];",
    "",
    "// Core exports that are deliberately NOT standalone snippets, with the",
    "// reason. The catalog test asserts entries + exclusions === core-api.json.",
    "export const EXPORT_CATALOG_EXCLUDED: Record<string, string> = " +
      JSON.stringify(catalog.excluded, null, 2) + ";",
    ""
  );
  return lines.join("\n");
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const catalog = generateExportCatalog();
  writeFileSync(GENERATED_MODULE_PATH, renderGeneratedModule(catalog));
  console.log(
    `Wrote ${catalog.entries.length} entries (+${
      Object.keys(catalog.excluded).length
    } exclusions) to ${GENERATED_MODULE_PATH}`
  );
}
