import { describe, expect, it } from "vitest";
import animationManifest from "../../animationManifest";
import coreApi from "./core-api.json";
import {
  getEntryIntro,
  getEntryTabs,
  MODULE_GUIDES,
  getEntryVisual,
} from "./docsManifest";

interface ApiEntry {
  name: string;
  module: string;
}

const apiEntries = coreApi as ApiEntry[];

function getExampleSlugs() {
  return new Set(
    Object.values(animationManifest).flatMap((category) =>
      Object.values(category).map((entry) => entry.slug),
    ),
  );
}

describe("api docs manifest", () => {
  it("guide key pieces all point at real exports in their module", () => {
    const exportIds = new Set(apiEntries.map((entry) => `${entry.module}:${entry.name}`));

    for (const [module, guide] of Object.entries(MODULE_GUIDES)) {
      for (const pieceName of guide.keyPieceNames) {
        expect(exportIds.has(`${module}:${pieceName}`)).toBe(true);
      }
    }
  });

  it("example visuals only point at real example routes", () => {
    const exampleSlugs = getExampleSlugs();

    for (const entry of apiEntries) {
      const visual = getEntryVisual(entry.name);
      if (visual.kind !== "example") continue;
      expect(visual.exampleSlug).toBeTruthy();
      expect(exampleSlugs.has(visual.exampleSlug!)).toBe(true);
    }
  });

  it("every export gets at least one docs tab", () => {
    for (const entry of apiEntries) {
      expect(getEntryTabs(entry).length).toBeGreaterThan(0);
    }
  });

  it("related-entry links point at real exports", () => {
    const exportNames = new Set(apiEntries.map((entry) => entry.name));

    for (const entry of apiEntries) {
      for (const related of getEntryIntro(entry).related) {
        expect(exportNames.has(related.name)).toBe(true);
      }
    }
  });
});
