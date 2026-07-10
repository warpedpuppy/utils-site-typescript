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

// The reference's reading spine: chapters follow the CONCEPTS teaching order
// (Numbers in motion first, systems last), modules follow each concept's curated
// modules list, and entries within a module follow MODULE_ENTRY_ORDER. Anything
// no concept claims lands in a final catch-all chapter, so filtering the full
// entry set through here can never lose an export.
export interface ConceptChapter {
  id: string;
  title: string;
  blurb: string;
  moduleGroups: [string, ApiEntry[]][];
  /** Narrator bridge to the next chapter; absent on the final chapter and the catch-all. */
  handoff?: string;
}

export function groupByConcept(entries: ApiEntry[]): ConceptChapter[] {
  const byModule = new Map<string, ApiEntry[]>();
  for (const entry of entries) {
    const list = byModule.get(entry.module) ?? [];
    list.push(entry);
    byModule.set(entry.module, list);
  }

  const claimed = new Set<string>();
  const chapters: ConceptChapter[] = [];
  for (const concept of CONCEPTS) {
    const moduleGroups: [string, ApiEntry[]][] = [];
    for (const module of concept.modules) {
      claimed.add(module);
      const list = byModule.get(module);
      if (list) moduleGroups.push([module, sortModuleEntries(module, list)]);
    }
    if (moduleGroups.length > 0) {
      chapters.push({
        id: makeConceptId(concept.title),
        title: concept.title,
        blurb: concept.blurb,
        moduleGroups,
        handoff: concept.handoff,
      });
    }
  }

  const leftovers: [string, ApiEntry[]][] = [];
  for (const [module, list] of byModule) {
    if (!claimed.has(module)) leftovers.push([module, sortModuleEntries(module, list)]);
  }
  if (leftovers.length > 0) {
    chapters.push({
      id: makeConceptId(CATCH_ALL_CONCEPT.title),
      ...CATCH_ALL_CONCEPT,
      moduleGroups: leftovers,
    });
  }
  return chapters;
}

// The complete reading order, computed once: every export in chapter →
// module → entry teaching order. Issue numbers ("№38 of 142") and the
// NEXT ISSUE hand-off both come from here, so they can never disagree
// with the newsstand's shelf order.
export const fullChapters = groupByConcept(apiEntries);

export const teachingOrderEntries: ApiEntry[] = fullChapters.flatMap((chapter) =>
  chapter.moduleGroups.flatMap(([, entries]) => entries),
);

const teachingIndexByName = new Map(
  teachingOrderEntries.map((entry, index) => [entry.name, index]),
);

/** 0-based position of an export in the teaching order (issue № is this + 1). */
export function getTeachingIndex(name: string): number {
  return teachingIndexByName.get(name) ?? -1;
}

const chapterNumberByConceptId = new Map(
  fullChapters.map((chapter, index) => [chapter.id, index + 1]),
);

/** 1-based chapter number in the reading spine (CH.1 = Numbers in motion). */
export function getChapterNumber(conceptId: string): number {
  return chapterNumberByConceptId.get(conceptId) ?? fullChapters.length;
}

const chapterByModule = new Map<string, ConceptChapter>(
  fullChapters.flatMap((chapter) =>
    chapter.moduleGroups.map(([module]): [string, ConceptChapter] => [module, chapter]),
  ),
);

/** The reading-spine chapter that claims a module (issue footers use this to spot chapter turns). */
export function getChapterForModule(module: string): ConceptChapter | undefined {
  return chapterByModule.get(module);
}

// Masthead lettering for the comic issue view: `lerpAngle` → "Lerp Angle",
// `HUE_FAMILIES` → "Hue Families". Display only — the real identifier stays
// verbatim everywhere code is shown.
export function comicDisplayTitle(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
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
