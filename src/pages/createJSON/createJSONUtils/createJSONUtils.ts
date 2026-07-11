import { InterfaceMap } from "../../../types/shapes";
import { ExportCatalogEntry, getCatalogEntry } from "../exportCatalog";
import { readSelection } from "../selectionStorage";

// Interfaces that must be declared before others that extend them.
export const INTERFACE_ORDER = [
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
];

export type ExportLang = "ts" | "js";

export interface SelectedEntry {
  key: string;
  title: string;
  category: string;
}

export interface GatheredSelection {
  entries: SelectedEntry[];
  /** Catalog entries for the picked functions, in selection order. */
  picked: ExportCatalogEntry[];
  /**
   * Helper entries pulled in because a pick (transitively) calls them, in
   * dependency-before-dependent order, deduplicated, excluding the picks.
   */
  dependencies: ExportCatalogEntry[];
  interfaces: string[];
}

/**
 * Resolve `dependencyKeys` transitively for one entry, appending each
 * dependency before its dependents. Throws on a dependency cycle (listing the
 * cycle) and on a dangling dependency key — both are catalog data bugs the
 * export tests fence.
 */
function resolveDependencies(
  entry: ExportCatalogEntry,
  resolved: Map<string, ExportCatalogEntry>,
  trail: string[]
): void {
  for (const depKey of entry.dependencyKeys) {
    if (trail.includes(depKey)) {
      throw new Error(
        `Dependency cycle in export catalog: ${[...trail, depKey].join(" → ")}`
      );
    }
    if (resolved.has(depKey)) continue;
    const dep = getCatalogEntry(depKey);
    if (!dep) {
      throw new Error(
        `Catalog entry "${entry.key}" depends on unknown key "${depKey}".`
      );
    }
    resolveDependencies(dep, resolved, [...trail, depKey]);
    // Post-order insertion ⇒ dependency-before-dependent.
    resolved.set(depKey, dep);
  }
}

// Single source of truth for what the current selection pulls in: the picked
// catalog entries, the helper entries they (transitively) depend on, and the
// shared interfaces they need (with parent interfaces auto-included). The live
// preview, the copy button, and both downloads all read from this so they can
// never drift.
export function gatherSelection(selectedKeys?: string[]): GatheredSelection {
  const selected = selectedKeys ?? readSelection();

  const picked: ExportCatalogEntry[] = [];
  const resolved = new Map<string, ExportCatalogEntry>();
  const interfaceNames = new Set<string>();

  for (const key of selected) {
    const entry = getCatalogEntry(key);
    if (!entry) continue; // stale/unknown key — storage migration drops these
    picked.push(entry);
    resolveDependencies(entry, resolved, [key]);
  }

  const pickedKeys = new Set(picked.map((e) => e.key));
  const dependencies = [...resolved.values()].filter(
    (e) => !pickedKeys.has(e.key)
  );

  for (const entry of [...picked, ...dependencies]) {
    for (const iface of entry.interfaceNames) {
      interfaceNames.add(iface);
      // pull in parent interfaces automatically
      if (iface === "Ball" || iface === "Rectangle")
        interfaceNames.add("ShapeInMotion");
      if (iface === "Polygon") interfaceNames.add("Vector");
      if (iface === "Line" || iface === "Triangle") interfaceNames.add("Point");
    }
  }

  return {
    entries: picked.map((e) => ({ key: e.key, title: e.title, category: e.group })),
    picked,
    dependencies,
    interfaces: INTERFACE_ORDER.filter(
      (name) => interfaceNames.has(name) && name in InterfaceMap
    ),
  };
}

// Format a gathered selection into a copy/download-ready file. Both language
// variants come from the build-time TypeScript-compiler catalog (tsSource /
// jsSource) — no runtime type-stripping. TypeScript additionally includes the
// shared interface block.
export function formatExport(lang: ExportLang, selectedKeys?: string[]): string {
  const { picked, dependencies, interfaces } = gatherSelection(selectedKeys);
  const source = (entry: ExportCatalogEntry) =>
    lang === "js" ? entry.jsSource : entry.tsSource;
  const parts: string[] = [];

  if (lang === "ts" && interfaces.length > 0) {
    parts.push("// ── interfaces " + "─".repeat(63));
    interfaces.forEach((name) => parts.push("\nexport " + InterfaceMap[name]));
  }

  if (dependencies.length > 0) {
    parts.push((parts.length ? "\n" : "") + "// ── dependencies " + "─".repeat(61));
    dependencies.forEach((dep) => parts.push("\n" + source(dep)));
  }

  if (picked.length > 0) {
    parts.push(
      (parts.length ? "\n" : "") + "// ── selected functions " + "─".repeat(55),
    );
    picked.forEach((entry) => parts.push("\nexport " + source(entry)));
  }

  return parts.join("\n");
}

export function downloadExport(lang: ExportLang) {
  triggerDownload(formatExport(lang), `utilspalooza-functions.${lang}`);
}

// Kept as thin backward-compatible wrappers over the unified generator.
export function downloadTsExport() {
  downloadExport("ts");
}

export function downloadJsExport() {
  downloadExport("js");
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
