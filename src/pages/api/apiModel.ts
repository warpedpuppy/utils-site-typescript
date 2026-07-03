// Data model for the /api reference: the shape of a generated API entry, the
// loaded entries, and the pure grouping/sorting/formatting helpers that turn
// them into concept groups and per-module lists. No JSX and no React state —
// ApiDocs.tsx (layout) and useApiDocsNavigation.ts (state) both import from here.
import coreApi from "./core-api.json";
import {
  CATCH_ALL_CONCEPT,
  CONCEPTS,
  getModuleDocMode,
  makeConceptId,
  MODULE_ENTRY_ORDER,
  MODULE_GUIDES,
  ModuleDocMode,
} from "./docsManifest";

export const CONCEPT_PREFIX = "concept-";

export interface ApiEntry {
  name: string;
  kind: "function" | "const" | "type";
  module: string;
  signature: string;
  description: string;
  params: { name: string; text: string }[];
  returns: string;
  example: string;
}

export const apiEntries = coreApi as ApiEntry[];

export interface ConceptGroup {
  id: string;
  title: string;
  blurb: string;
  items: ApiEntry[];
  systemGuideModules: number;
  conceptSetModules: number;
  referenceModules: number;
}

// JSDoc descriptions may contain inline {@link name} tags — render them as plain text.
export function cleanDoc(text: string): string {
  return text.replace(/\{@link\s+([^}]+)\}/g, (_m, ref) => ref.trim());
}

// Preserve the source order (alphabetical by module, then name) while grouping.
export function groupByModule(entries: ApiEntry[]): [string, ApiEntry[]][] {
  const groups = new Map<string, ApiEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.module) ?? [];
    list.push(entry);
    groups.set(entry.module, list);
  }
  return [...groups.entries()].map(([module, list]) => [module, sortModuleEntries(module, list)]);
}

function sortModuleEntries(module: string, entries: ApiEntry[]): ApiEntry[] {
  const preferredOrder = MODULE_ENTRY_ORDER[module];
  if (!preferredOrder) return entries;
  const rank = new Map(preferredOrder.map((name, index) => [name, index]));
  return [...entries].sort((a, b) => {
    const aRank = rank.get(a.name) ?? Number.MAX_SAFE_INTEGER;
    const bRank = rank.get(b.name) ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  });
}

export function renderImportLine(entry: ApiEntry): string {
  if (entry.kind === "type") {
    return `import type { ${entry.name} } from "@utilspalooza/core";`;
  }
  return `import { ${entry.name} } from "@utilspalooza/core";`;
}

function countConceptModulesByMode(entries: ApiEntry[]) {
  const seen = new Map<string, ModuleDocMode>();
  for (const entry of entries) {
    if (!seen.has(entry.module)) {
      seen.set(entry.module, getModuleDocMode(entry.module));
    }
  }

  let systemGuideModules = 0;
  let conceptSetModules = 0;
  let referenceModules = 0;
  for (const [module, mode] of seen.entries()) {
    if (mode === "guide") {
      const guideKind = MODULE_GUIDES[module]?.guideKind;
      if (guideKind === "system") systemGuideModules += 1;
      else conceptSetModules += 1;
      continue;
    }
    referenceModules += 1;
  }

  return { systemGuideModules, conceptSetModules, referenceModules };
}

// Build concept groups straight from the generated docs data. Each concept lists
// every export whose source module it claims; anything unclaimed is collected
// into the catch-all so nothing the package exports is ever hidden here.
function buildConceptGroups(): ConceptGroup[] {
  const moduleToConcept = new Map<string, number>();
  CONCEPTS.forEach((concept, i) => {
    for (const mod of concept.modules) moduleToConcept.set(mod, i);
  });

  const buckets: ApiEntry[][] = CONCEPTS.map(() => []);
  const leftovers: ApiEntry[] = [];
  for (const entry of apiEntries) {
    const i = moduleToConcept.get(entry.module);
    if (i === undefined) leftovers.push(entry);
    else buckets[i].push(entry);
  }

  const groups = CONCEPTS.map((concept, i) => ({
    id: makeConceptId(concept.title),
    title: concept.title,
    blurb: concept.blurb,
    items: buckets[i],
    ...countConceptModulesByMode(buckets[i]),
  })).filter((g) => g.items.length > 0);

  if (leftovers.length > 0) {
    groups.push({
      id: makeConceptId(CATCH_ALL_CONCEPT.title),
      ...CATCH_ALL_CONCEPT,
      items: leftovers,
      ...countConceptModulesByMode(leftovers),
    });
  }
  return groups;
}

export const conceptGroups = buildConceptGroups();

const conceptByModule = new Map(
  conceptGroups.flatMap((group) =>
    [...new Set(group.items.map((entry) => entry.module))].map((module) => [module, group] as const),
  ),
);

export function getConceptForModule(module: string): ConceptGroup | undefined {
  return conceptByModule.get(module);
}
