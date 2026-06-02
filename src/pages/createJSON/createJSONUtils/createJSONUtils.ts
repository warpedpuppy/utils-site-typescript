import { useMemo } from "react";
import LocalStorageManager from "../../../services/LocalStorageManager";
import SiteData from "../../../siteData/SiteData";
import { InterfaceMap } from "../../../types/shapes";

export function CreateJson() {
  const { getLocalStorageAsArray } = LocalStorageManager();
  let value = useMemo(() => {
    let arrayOfFormulas: any = getLocalStorageAsArray();
    let set = new Set();
    let str = ``;

    Object.values(SiteData).forEach((objects) => {
      Object.entries(objects).forEach((keyValues) => {
        if (arrayOfFormulas.includes(keyValues[0])) {
          set.add(keyValues[1].f.functionString);
          keyValues[1].f.dependencies.forEach((dependency: string) => {
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
const INTERFACE_ORDER = [
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

export function downloadTsExport() {
  const selected: string[] = (localStorage.getItem("functions")
    ? localStorage.getItem("functions")!.split(",")
    : []);

  const functionStrings: string[] = [];
  const dependencySet = new Set<string>();
  const interfaceNames = new Set<string>();

  Object.values(SiteData).forEach((objects) => {
    Object.entries(objects).forEach(([key, value]) => {
      if (selected.includes(key)) {
        functionStrings.push(value.f.functionString.trim());
        value.f.dependencies.forEach((dep: string) => dependencySet.add(dep.trim()));
        (value.f.interfaces ?? []).forEach((iface: string) => {
          interfaceNames.add(iface);
          // pull in parent interfaces automatically
          if (iface === "Ball" || iface === "Rectangle") interfaceNames.add("ShapeInMotion");
          if (iface === "Polygon") interfaceNames.add("Vector");
          if (iface === "Line" || iface === "Triangle") interfaceNames.add("Point");
        });
      }
    });
  });

  const orderedInterfaces = INTERFACE_ORDER.filter((name) => interfaceNames.has(name));

  const parts: string[] = [];

  if (orderedInterfaces.length > 0) {
    parts.push("// ── interfaces " + "─".repeat(63));
    orderedInterfaces.forEach((name) => {
      parts.push("\nexport " + InterfaceMap[name]);
    });
  }

  if (dependencySet.size > 0) {
    parts.push("\n// ── dependencies " + "─".repeat(61));
    dependencySet.forEach((dep) => parts.push("\n" + dep));
  }

  if (functionStrings.length > 0) {
    parts.push("\n// ── selected functions " + "─".repeat(55));
    functionStrings.forEach((fn) => parts.push("\nexport function " + fn.replace(/^function\s+/, "")));
  }

  const fileContent = parts.join("\n");

  triggerDownload(fileContent, "utilspalooza-functions.ts");
}

export function downloadJsExport() {
  const selected: string[] = (localStorage.getItem("functions")
    ? localStorage.getItem("functions")!.split(",")
    : []);

  const functionStrings: string[] = [];
  const dependencySet = new Set<string>();

  Object.values(SiteData).forEach((objects) => {
    Object.entries(objects).forEach(([key, value]) => {
      if (selected.includes(key)) {
        functionStrings.push(value.f.functionString.trim());
        value.f.dependencies.forEach((dep: string) => dependencySet.add(dep.trim()));
      }
    });
  });

  const parts: string[] = [];

  if (dependencySet.size > 0) {
    parts.push("// ── dependencies " + "─".repeat(61));
    dependencySet.forEach((dep) =>
      parts.push("\n" + stripTypeScript(dep))
    );
  }

  if (functionStrings.length > 0) {
    parts.push("\n// ── selected functions " + "─".repeat(55));
    functionStrings.forEach((fn) =>
      parts.push("\nexport function " + stripTypeScript(fn).replace(/^function\s+/, ""))
    );
  }

  triggerDownload(parts.join("\n"), "utilspalooza-functions.js");
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
