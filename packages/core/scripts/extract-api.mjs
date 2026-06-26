#!/usr/bin/env node
// Shared API extractor for @utilspalooza/core.
//
// Uses the TypeScript compiler API to read the *real* source of every public
// module and pull its JSDoc (description, @param, @returns, @example) plus a
// rendered type signature. This is the single source of truth behind BOTH:
//   - scripts/generate-api-docs.mjs  → writes src/pages/api/core-api.json (the
//     data the Documentation tab renders), and
//   - src/pages/api/api-docs-complete.test.ts → fails if any function ships
//     without docs, so the docs can never silently fall behind the exports.
//
// File selection mirrors generate-barrel.mjs exactly: top-level + nested public
// *.ts, excluding index.ts, legacy.ts / Legacy*, *.d.ts and *.test.ts. That
// keeps "documented" == "what the root barrel actually re-exports".

import ts from "typescript";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const SRC_DIR = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "src"
);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (
      name.endsWith(".ts") &&
      !name.endsWith(".d.ts") &&
      !name.endsWith(".test.ts") &&
      name !== "index.ts" &&
      name !== "legacy.ts" &&
      !name.startsWith("Legacy")
    ) {
      out.push(full);
    }
  }
  return out;
}

function tagText(tag) {
  if (!tag.text) return "";
  return ts.displayPartsToString(tag.text).trim();
}

// Classify an exported symbol into the bucket the docs/test care about:
//   "function" — callable (function decl, or const holding an arrow/function)
//   "const"    — a non-callable value export (data tables, etc.)
//   "type"     — interface or type alias
function classify(symbol, checker, decl) {
  if (decl && (ts.isInterfaceDeclaration(decl) || ts.isTypeAliasDeclaration(decl))) {
    return "type";
  }
  const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
  if (type.getCallSignatures().length > 0) return "function";
  return "const";
}

export function extractApi(srcDir = SRC_DIR) {
  const files = walk(srcDir).sort((a, b) => a.localeCompare(b));

  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();

  const entries = [];

  for (const file of files) {
    const sf = program.getSourceFile(file);
    if (!sf) continue;
    const moduleSymbol = checker.getSymbolAtLocation(sf);
    if (!moduleSymbol) continue;

    const moduleName = relative(srcDir, file)
      .replace(/\.ts$/, "")
      .split(sep)
      .join("/");

    for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
      const decl = symbol.declarations?.[0];
      if (!decl) continue;

      const kind = classify(symbol, checker, decl);

      const description = ts
        .displayPartsToString(symbol.getDocumentationComment(checker))
        .trim();

      const tags = symbol.getJsDocTags(checker);
      const params = [];
      let returns = "";
      const examples = [];
      for (const tag of tags) {
        if (tag.name === "param") {
          // displayParts for @param is "<name> - <description>"
          const raw = tagText(tag);
          const m = raw.match(/^(\S+)\s*-?\s*([\s\S]*)$/);
          params.push({ name: m ? m[1] : raw, text: m ? m[2].trim() : "" });
        } else if (tag.name === "returns" || tag.name === "return") {
          returns = tagText(tag);
        } else if (tag.name === "example") {
          examples.push(tagText(tag));
        }
      }

      let signature = "";
      const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
      if (kind === "type") {
        signature = symbol.getName();
      } else {
        signature = checker.typeToString(
          type,
          decl,
          ts.TypeFormatFlags.NoTruncation |
            ts.TypeFormatFlags.WriteArrowStyleSignature
        );
      }

      entries.push({
        name: symbol.getName(),
        kind,
        module: moduleName,
        signature,
        description,
        params,
        returns,
        example: examples.join("\n\n"),
      });
    }
  }

  entries.sort(
    (a, b) =>
      a.module.localeCompare(b.module) || a.name.localeCompare(b.name)
  );

  return entries;
}
