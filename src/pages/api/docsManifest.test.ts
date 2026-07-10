import { describe, expect, it } from "vitest";
import animationManifest from "../../animationManifest";
import coreApi from "./core-api.json";
import {
  CONCEPTS,
  ENTRY_DOCS,
  ENTRY_PANEL_SIZES,
  getEntryIntro,
  getEntryPanelSize,
  getEntryTabs,
  getEntryUsageLead,
  MODULE_GUIDES,
  getEntryVisual,
} from "./docsManifest";

interface ApiEntry {
  name: string;
  module: string;
  kind: string;
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

  it("every function export has a bespoke Explain It intro (easing family excepted)", () => {
    // Coverage reached 100% of function exports on 2026-07-05; this fence keeps
    // it there. A missing ENTRY_DOCS entry silently falls back to generated
    // boilerplate, so without this test the regression would be invisible.
    // The Easing module is the one sanctioned exception: its intros are built
    // from the shared family writeup plus each curve's own JSDoc line (which
    // api-docs-complete.test.ts enforces), so per-curve entries would only
    // duplicate that.
    const missing = apiEntries
      .filter((entry) => entry.kind === "function" && entry.module !== "Easing")
      .filter((entry) => {
        const doc = ENTRY_DOCS[entry.name];
        return !doc?.whatItIs?.trim() || !doc?.howToUse?.trim();
      })
      .map((entry) => `${entry.module}:${entry.name}`);

    expect(missing).toEqual([]);
  });

  it("angle interpolation entries get specific usage leads", () => {
    expect(getEntryUsageLead({ module: "AngleInterpolation", name: "lerpAngle" })).toContain("short turn");
    expect(getEntryUsageLead({ module: "AngleInterpolation", name: "shortestAngleBetween" })).toContain("signed shortest turn");
    expect(getEntryUsageLead({ module: "AngleInterpolation", name: "wrapAngle" })).toContain("370°");
  });

  // The Full Reference's default view is the newsstand, whose issue tiles render
  // each entry as "name + usage lead" — a blank lead would render a broken tile.
  it("every export has a non-empty usage lead for the newsstand tiles", () => {
    const missing = apiEntries
      .filter(
        (entry) =>
          getEntryUsageLead({
            module: entry.module,
            name: entry.name,
            kind: entry.kind as "function" | "const" | "type",
          }).trim() === "",
      )
      .map((entry) => `${entry.module}:${entry.name}`);

    expect(missing).toEqual([]);
  });

  // Phase 5 narrator-voice fence: every function's lead is visible on its
  // newsstand tile, its issue masthead, and the NEXT ISSUE teaser, so no
  // function may fall through to a generic module-family filler line. The
  // strings below are quoted verbatim from getEntryUsageLead's fallbacks —
  // if one changes there, change it here too. Types and consts are exempt
  // (their generic lines are accurate for what they are).
  it("no function export falls back to a generic usage lead", () => {
    const genericLeads = new Set([
      "This one helps answer: are these things touching yet?",
      "This one helps a value move in a useful way.",
      "This one is great for loops, waves, turning, and repeated motion.",
      "This one helps with direction, distance, shape, or placement.",
      "This one helps colors change or work nicely together.",
      "This one creates motion or behavior you can actually see.",
      "This is a small helper you can plug into an animation.",
    ]);

    const generic = apiEntries
      .filter((entry) => entry.kind === "function")
      .filter((entry) =>
        genericLeads.has(
          getEntryUsageLead({
            module: entry.module,
            name: entry.name,
            kind: "function",
          }),
        ),
      )
      .map((entry) => `${entry.module}:${entry.name}`);

    expect(generic).toEqual([]);
  });

  // The graphic-novel page-turn: every chapter except the last must bridge to
  // its successor. A missing handoff silently drops the narrator mid-book.
  it("every chapter except the last has a hand-off to the next", () => {
    const missing = CONCEPTS.slice(0, -1)
      .filter((concept) => !concept.handoff?.trim())
      .map((concept) => concept.title);

    expect(missing).toEqual([]);
    expect(CONCEPTS[CONCEPTS.length - 1].handoff).toBeUndefined();
  });

  // Phase 4 pacing: a splash assignment for a renamed/removed export would
  // silently do nothing, and a splash entry without a live demo would feature
  // a cover with no story inside.
  it("panel-size assignments point at real exports and splashes have visuals", () => {
    const exportNames = new Set(apiEntries.map((entry) => entry.name));

    for (const name of Object.keys(ENTRY_PANEL_SIZES)) {
      expect(exportNames.has(name)).toBe(true);
      if (ENTRY_PANEL_SIZES[name] === "splash") {
        expect(getEntryVisual(name).kind).not.toBe("none");
      }
    }

    // Types and consts never have demos to give room to — compact unless a
    // direct assignment says otherwise (Flock is a class, and a flagship).
    for (const entry of apiEntries) {
      if (ENTRY_PANEL_SIZES[entry.name]) continue;
      if (entry.kind === "type" || entry.kind === "const") {
        expect(
          getEntryPanelSize({
            module: entry.module,
            name: entry.name,
            kind: entry.kind as "const" | "type",
          }),
        ).toBe("compact");
      }
    }
  });

  it("collision entries get shape-specific usage leads", () => {
    expect(getEntryUsageLead({ module: "PointToCircle", name: "pointToCircle" })).toBe(
      "This one helps answer: is this point inside the circle yet?",
    );
    expect(getEntryUsageLead({ module: "LineToLine", name: "lineToLine" })).toBe(
      "This one helps answer: are these lines crossing yet?",
    );
    expect(getEntryUsageLead({ module: "RectToRect", name: "rectToRect" })).toBe(
      "This one helps answer: are these rectangles overlapping yet?",
    );
    // Object-API twins live under CollisionObjectAPI/* module ids — a rename
    // there once silently dropped them to the generic touching line.
    expect(getEntryUsageLead({ module: "CollisionObjectAPI/PolygonCircle", name: "polygonCircle" })).toBe(
      "This one helps answer: is this circle touching the polygon yet?",
    );
    expect(getEntryUsageLead({ module: "CollisionObjectAPI/LineLine", name: "lineLine" })).toBe(
      "This one helps answer: exactly where do these two lines cross?",
    );
  });
});
