// Fences for the Full Reference reading spine (groupByConcept): the reference
// must stay COMPLETE API docs (every export appears exactly once) while reading
// in teaching order, never alphabetical file order. Part of the graphic-novel
// reference plan (.claude/PLAN-API-GRAPHIC-NOVEL.md, Phase 1).
import { describe, expect, it } from "vitest";
import {
  apiEntries,
  comicDisplayTitle,
  getChapterNumber,
  getTeachingIndex,
  groupByConcept,
  teachingOrderEntries,
} from "./apiModel";
import { CATCH_ALL_CONCEPT, CONCEPTS } from "./docsManifest";

const chapters = groupByConcept(apiEntries);
const flatNames = chapters.flatMap((chapter) =>
  chapter.moduleGroups.flatMap(([, entries]) => entries.map((entry) => entry.name)),
);

describe("groupByConcept — the reference spine", () => {
  it("keeps every export: each entry appears exactly once across chapters", () => {
    const keys = chapters.flatMap((chapter) =>
      chapter.moduleGroups.flatMap(([, entries]) =>
        entries.map((entry) => `${entry.module}.${entry.name}`),
      ),
    );
    expect(keys.length).toBe(apiEntries.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("chapters follow the CONCEPTS teaching order, catch-all last", () => {
    const conceptTitles = CONCEPTS.map((concept) => concept.title);
    const chapterTitles = chapters.map((chapter) => chapter.title);
    const orderedConceptTitles = chapterTitles.filter((title) => conceptTitles.includes(title));
    expect(orderedConceptTitles).toEqual(
      conceptTitles.filter((title) => chapterTitles.includes(title)),
    );
    // Any chapter that is not a concept must be the trailing catch-all.
    chapterTitles.forEach((title, index) => {
      if (!conceptTitles.includes(title)) {
        expect(title).toBe(CATCH_ALL_CONCEPT.title);
        expect(index).toBe(chapterTitles.length - 1);
      }
    });
  });

  it("every module CONCEPTS claims exists in the generated docs data", () => {
    const realModules = new Set(apiEntries.map((entry) => entry.module));
    for (const concept of CONCEPTS) {
      for (const module of concept.modules) {
        expect(realModules.has(module), `"${module}" in "${concept.title}" is stale`).toBe(true);
      }
    }
  });

  it("opens with lerp — the story's chapter one", () => {
    expect(flatNames[0]).toBe("lerp");
  });

  it("teaches the trig staircase in order: unit circle before sine curve before sine wave", () => {
    const unitCircle = flatNames.indexOf("unitCirclePoint");
    const sineCurve = flatNames.indexOf("sineCurve");
    const sineWave = flatNames.indexOf("sineWave");
    const waveAmplitude = flatNames.indexOf("waveAmplitude");
    expect(unitCircle).toBeGreaterThan(-1);
    expect(unitCircle).toBeLessThan(sineCurve);
    expect(sineCurve).toBeLessThan(sineWave);
    expect(sineWave).toBeLessThan(waveAmplitude);
  });

  it("numbers every issue: teaching order covers each export exactly once", () => {
    // The newsstand's issue numbers (№N of total) and the NEXT ISSUE hand-off
    // both index into teachingOrderEntries — a gap or duplicate would number
    // two issues the same or skip one.
    expect(teachingOrderEntries.length).toBe(apiEntries.length);
    const names = teachingOrderEntries.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);
    names.forEach((name, index) => {
      expect(getTeachingIndex(name)).toBe(index);
    });
  });

  it("gives every chapter a stable 1-based number in spine order", () => {
    chapters.forEach((chapter, index) => {
      expect(getChapterNumber(chapter.id)).toBe(index + 1);
    });
  });

  it("letters masthead titles from identifiers without mangling them", () => {
    expect(comicDisplayTitle("lerpAngle")).toBe("Lerp Angle");
    expect(comicDisplayTitle("circleToCircle")).toBe("Circle To Circle");
    expect(comicDisplayTitle("HUE_FAMILIES")).toBe("Hue Families");
    expect(comicDisplayTitle("Point")).toBe("Point");
    expect(comicDisplayTitle("easeInOutQuad")).toBe("Ease In Out Quad");
  });

  it("filters flow through the spine without losing matches", () => {
    const q = "vec";
    const filtered = apiEntries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.module.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    );
    const grouped = groupByConcept(filtered);
    const shown = grouped.flatMap((chapter) =>
      chapter.moduleGroups.flatMap(([, entries]) => entries),
    );
    expect(shown.length).toBe(filtered.length);
  });
});
