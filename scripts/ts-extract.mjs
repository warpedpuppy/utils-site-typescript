// Shared TypeScript-compiler-API extraction helpers used by the build-time
// source generators (generate-codepen-sources.mjs and
// generate-export-catalog.mjs). Everything here works on the AST — never
// regexes — per the 2026-07-11 remediation operating rules.

import ts from "typescript";

export function hasExportModifier(statement) {
  return (
    ts.canHaveModifiers(statement) &&
    (ts.getModifiers(statement) ?? []).some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword
    )
  );
}

export function withoutExportModifier(statement, factory = ts.factory) {
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

export function collectNamedExportNames(sourceFile) {
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

/**
 * Locate the single exported function declaration or exported single-declarator
 * variable statement named `exportName`. A declaration counts as exported when
 * it carries the `export` modifier or a separate `export { name }` statement
 * exports it. 0 or >1 matches is a hard error.
 */
export function findExportedDeclaration(sourceFile, exportName, sourcePath) {
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

export function parseSource(sourcePath, sourceText) {
  return ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    sourcePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
}

/** Print a declaration (export modifier stripped) back to TypeScript text. */
export function printDeclaration(declaration, sourceFile) {
  const stripped = withoutExportModifier(declaration);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printNode(ts.EmitHint.Unspecified, stripped, sourceFile);
}

/**
 * Transpile a standalone TypeScript declaration to plain JavaScript,
 * preserving the identifier and dropping the transpiler's `"use strict"`
 * directive prologue (callers embed several declarations into one file, and
 * some embeds sit in expression position where a directive is a syntax error).
 */
export function transpileDeclaration(tsDeclaration, fileName) {
  const transpiled = ts.transpileModule(tsDeclaration, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
    fileName,
  }).outputText;
  return transpiled.replace(/^"use strict";\r?\n/, "").trimEnd();
}
