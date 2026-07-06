import { useMemo } from "react";
import LocalStorageManager from "../../../services/LocalStorageManager";
import animationManifest from "../../../animationManifest";
import { InterfaceMap } from "../../../types/shapes";

export function CreateJson() {
  const { getLocalStorageAsArray } = LocalStorageManager();
  let value = useMemo(() => {
    const arrayOfFormulas: string[] = getLocalStorageAsArray() ?? [];
    let set = new Set();
    let str = ``;

    Object.values(animationManifest).forEach((objects) => {
      Object.entries(objects).forEach((keyValues) => {
        if (arrayOfFormulas.includes(keyValues[0])) {
          set.add(keyValues[1].formula.functionString);
          keyValues[1].formula.dependencies.forEach((dependency: string) => {
            set.add(dependency);
          });
        }
      });
    });

    set.forEach((item) => {
      str += item;
    });

    return str;
  }, [getLocalStorageAsArray]);

  return value;
}

function stripTypeScript(code: string): string {
  return code
    // ): ReturnType { → ) {
    .replace(/\)\s*:\s*[\w[\]|<> ]+(?=\s*\{)/g, ")")
    // : TypeAnnotation in params / variable declarations
    .replace(
      /:\s*(number|string|boolean|void|any|never|unknown|Function|[A-Z][A-Za-z]*(?:<[^>]*>)?(?:\[\])?)/g,
      ""
    )
    .replace(/ {2,}/g, " ");
}

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
  functionStrings: string[];
  dependencies: string[];
  interfaces: string[];
}

// Single source of truth for what the current selection pulls in: the picked
// entries, their function bodies, the helper functions they depend on, and the
// shared interfaces they need (with parent interfaces auto-included). The live
// preview, the copy button, and both downloads all read from this so they can
// never drift.
export function gatherSelection(selectedKeys?: string[]): GatheredSelection {
  const selected =
    selectedKeys ??
    (localStorage.getItem("functions") ?? "").split(",").filter(Boolean);

  const entries: SelectedEntry[] = [];
  const functionStrings: string[] = [];
  const dependencySet = new Set<string>();
  const interfaceNames = new Set<string>();

  Object.entries(animationManifest).forEach(([category, objects]) => {
    Object.entries(objects).forEach(([key, value]) => {
      if (!selected.includes(key)) return;
      entries.push({ key, title: value.title, category });
      functionStrings.push(value.formula.functionString.trim());
      value.formula.dependencies.forEach((dep: string) =>
        dependencySet.add(dep.trim()),
      );
      (value.formula.interfaces ?? []).forEach((iface: string) => {
        interfaceNames.add(iface);
        // pull in parent interfaces automatically
        if (iface === "Ball" || iface === "Rectangle")
          interfaceNames.add("ShapeInMotion");
        if (iface === "Polygon") interfaceNames.add("Vector");
        if (iface === "Line" || iface === "Triangle") interfaceNames.add("Point");
      });
    });
  });

  return {
    entries,
    functionStrings,
    dependencies: [...dependencySet],
    interfaces: INTERFACE_ORDER.filter((name) => interfaceNames.has(name)),
  };
}

// Format a gathered selection into a copy/download-ready file. TypeScript keeps
// the interface block and type annotations; JavaScript strips both.
export function formatExport(lang: ExportLang, selectedKeys?: string[]): string {
  const { functionStrings, dependencies, interfaces } =
    gatherSelection(selectedKeys);
  const parts: string[] = [];

  if (lang === "ts" && interfaces.length > 0) {
    parts.push("// ── interfaces " + "─".repeat(63));
    interfaces.forEach((name) => parts.push("\nexport " + InterfaceMap[name]));
  }

  if (dependencies.length > 0) {
    parts.push((parts.length ? "\n" : "") + "// ── dependencies " + "─".repeat(61));
    dependencies.forEach((dep) =>
      parts.push("\n" + (lang === "js" ? stripTypeScript(dep) : dep)),
    );
  }

  if (functionStrings.length > 0) {
    parts.push(
      (parts.length ? "\n" : "") + "// ── selected functions " + "─".repeat(55),
    );
    functionStrings.forEach((fn) => {
      const body = lang === "js" ? stripTypeScript(fn) : fn;
      parts.push("\nexport function " + body.replace(/^function\s+/, ""));
    });
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
