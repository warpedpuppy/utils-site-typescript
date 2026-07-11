// Build-time CodePen source generator (Work Package 2B of the 2026-07-11 code
// review remediation). Replaces runtime Function.prototype.toString()
// serialization, which production minification breaks.
//
// For every entry in scripts/codepen-source-manifest.mjs this script:
//   1. parses the canonical TypeScript source with the TypeScript compiler API
//      (never regexes),
//   2. locates the single exported function declaration or exported variable
//      declaration named `exportName` (0 or >1 matches is a hard error),
//   3. removes only the `export` modifier through the AST/printer path,
//   4. transpiles the declaration to plain JavaScript with the TypeScript
//      compiler, preserving the original identifier,
//   5. writes a deterministic generated module at
//      src/pages/studio/generatedCodepenSources.ts (keys sorted
//      alphabetically) exporting CODEPEN_FUNCTION_SOURCES.
//
// Run:  node scripts/generate-codepen-sources.mjs
// A drift test (src/pages/studio/generated-codepen-sources.test.ts) compares
// fresh output from generateCodepenSources() against the committed module.

import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { CODEPEN_SOURCE_MANIFEST } from "./codepen-source-manifest.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_MODULE_PATH = join(
  REPO_ROOT,
  "src/pages/studio/generatedCodepenSources.ts"
);

function hasExportModifier(statement) {
  return (
    ts.canHaveModifiers(statement) &&
    (ts.getModifiers(statement) ?? []).some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword
    )
  );
}

function withoutExportModifier(statement, factory) {
  const modifiers = (ts.getModifiers(statement) ?? []).filter(
    (m) => m.kind !== ts.SyntaxKind.ExportKeyword
  );
  if (ts.isFunctionDeclaration(statement)) {
    return factory.updateFunctionDeclaration(
      statement,
      modifiers,
      statement.asteriskToken,
      statement.name,
      statement.typeParameters,
      statement.parameters,
      statement.type,
      statement.body
    );
  }
  if (ts.isVariableStatement(statement)) {
    return factory.updateVariableStatement(
      statement,
      modifiers,
      statement.declarationList
    );
  }
  throw new Error(`Unsupported statement kind ${ts.SyntaxKind[statement.kind]}`);
}

function collectNamedExportNames(sourceFile) {
  const names = new Set();
  for (const statement of sourceFile.statements) {
    if (
      ts.isExportDeclaration(statement) &&
      !statement.moduleSpecifier &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const el of statement.exportClause.elements) {
        // Local name of the export (`export { local as public }` → local).
        names.add((el.propertyName ?? el.name).text);
      }
    }
  }
  return names;
}

function findExportedDeclaration(sourceFile, exportName, sourcePath) {
  // A declaration counts as exported when it carries the `export` modifier or
  // when a separate `export { name }` statement in the same file exports it.
  const namedExports = collectNamedExportNames(sourceFile);
  const matches = [];
  for (const statement of sourceFile.statements) {
    if (!hasExportModifier(statement) && !namedExports.has(exportName)) continue;
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === exportName
    ) {
      matches.push(statement);
    } else if (ts.isVariableStatement(statement)) {
      const declared = statement.declarationList.declarations.filter(
        (d) => ts.isIdentifier(d.name) && d.name.text === exportName
      );
      if (declared.length > 0) {
        if (statement.declarationList.declarations.length !== 1) {
          throw new Error(
            `Export "${exportName}" in ${sourcePath} shares a variable statement ` +
              `with other declarators — split it so it can be extracted alone.`
          );
        }
        matches.push(statement);
      }
    }
  }
  if (matches.length === 0) {
    throw new Error(
      `Export "${exportName}" not found as an exported function or variable ` +
        `declaration in ${sourcePath}.`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Export "${exportName}" matches ${matches.length} declarations in ` +
        `${sourcePath} — expected exactly one.`
    );
  }
  return matches[0];
}

/**
 * Pure generation pass: manifest → { exportName: plainJsSource }, keys sorted
 * alphabetically. Reads only the canonical TypeScript sources; writes nothing.
 */
export function generateCodepenSources() {
  const entries = new Map();
  for (const { exportName, sourceFile } of CODEPEN_SOURCE_MANIFEST) {
    if (entries.has(exportName)) {
      throw new Error(`Duplicate manifest exportName "${exportName}".`);
    }
    const absolutePath = join(REPO_ROOT, sourceFile);
    const sourceText = readFileSync(absolutePath, "utf8");
    const parsed = ts.createSourceFile(
      sourceFile,
      sourceText,
      ts.ScriptTarget.Latest,
      /* setParentNodes */ true,
      sourceFile.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );

    const declaration = findExportedDeclaration(parsed, exportName, sourceFile);
    const stripped = withoutExportModifier(declaration, ts.factory);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const tsDeclaration = printer.printNode(
      ts.EmitHint.Unspecified,
      stripped,
      parsed
    );

    const transpiled = ts.transpileModule(tsDeclaration, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
      fileName: sourceFile,
    }).outputText;

    // transpileModule prepends a `"use strict";` directive prologue. Drop it:
    // pens embed several declarations into one payload (and one embeds inside
    // an object literal, where a directive would be a syntax error).
    const jsSource = transpiled.replace(/^"use strict";\r?\n/, "").trimEnd();
    if (!jsSource.includes(exportName)) {
      throw new Error(
        `Transpiled source for "${exportName}" lost its identifier — refusing ` +
          `to emit an uncallable declaration.`
      );
    }
    entries.set(exportName, jsSource);
  }

  return Object.fromEntries(
    [...entries.entries()].sort(([a], [b]) => (a < b ? -1 : 1))
  );
}

/** Renders the generated module text for a sources record. */
export function renderGeneratedModule(sources) {
  const lines = [
    "// AUTO-GENERATED by scripts/generate-codepen-sources.mjs — DO NOT EDIT.",
    "// Regenerate with:  node scripts/generate-codepen-sources.mjs",
    "//",
    "// Plain-JavaScript source text for every function embedded in a Studio",
    "// CodePen payload, extracted at build time from the canonical TypeScript",
    "// declarations listed in scripts/codepen-source-manifest.mjs. Because these",
    "// are string literals, production minification cannot rename the",
    "// declarations out from under the handwritten pen glue.",
    "",
    "export const CODEPEN_FUNCTION_SOURCES: Record<string, string> = {",
  ];
  for (const [name, source] of Object.entries(sources)) {
    lines.push(`  ${name}: ${JSON.stringify(source)},`);
  }
  lines.push("};", "");
  return lines.join("\n");
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const sources = generateCodepenSources();
  writeFileSync(GENERATED_MODULE_PATH, renderGeneratedModule(sources));
  console.log(
    `Wrote ${Object.keys(sources).length} sources to ${GENERATED_MODULE_PATH}`
  );
}
