// Function-grained Copy Code catalog (Work Package 3 of the 2026-07-11 code
// review remediation). One entry per copyable @utilspalooza/core export —
// the 18 easing functions are individually selectable, scalars are
// first-class, and nothing is inferred from Function.name or an animation
// manifest walk.
//
// The snippet text lives in the GENERATED exportCatalogData.ts (produced by
// scripts/generate-export-catalog.mjs with the TypeScript compiler at build
// time). This module adds presentation: the picker group each entry belongs
// to, derived from the /api concept map (docsManifest CONCEPTS) so the
// vocabulary a visitor learns in the docs is the vocabulary in the picker.

import {
  EXPORT_CATALOG_DATA,
  EXPORT_CATALOG_EXCLUDED,
} from "./exportCatalogData";
import { CONCEPTS, CATCH_ALL_CONCEPT } from "../api/docsManifest";

export { EXPORT_CATALOG_EXCLUDED };

export interface ExportCatalogEntry {
  key: string;
  title: string;
  group: string;
  tsSource: string;
  jsSource: string;
  dependencyKeys: string[];
  interfaceNames: string[];
}

const moduleToGroup = new Map<string, string>();
for (const concept of CONCEPTS) {
  for (const module of concept.modules) {
    moduleToGroup.set(module, concept.title);
  }
}

export const EXPORT_CATALOG: ExportCatalogEntry[] = EXPORT_CATALOG_DATA.map(
  (data) => ({
    key: data.key,
    // Production labels must be the canonical API names — the
    // production-contract test asserts label === key.
    title: data.key,
    group: moduleToGroup.get(data.module) ?? CATCH_ALL_CONCEPT.title,
    tsSource: data.tsSource,
    jsSource: data.jsSource,
    dependencyKeys: data.dependencyKeys,
    interfaceNames: data.interfaceNames,
  })
);

const catalogByKey = new Map(EXPORT_CATALOG.map((e) => [e.key, e]));

export function getCatalogEntry(key: string): ExportCatalogEntry | undefined {
  return catalogByKey.get(key);
}

/** Picker group order: the /api concept-map reading order, catch-all last. */
export const EXPORT_GROUP_ORDER: string[] = [
  ...CONCEPTS.map((c) => c.title).filter((title) =>
    EXPORT_CATALOG.some((e) => e.group === title)
  ),
  ...(EXPORT_CATALOG.some((e) => e.group === CATCH_ALL_CONCEPT.title)
    ? [CATCH_ALL_CONCEPT.title]
    : []),
];
