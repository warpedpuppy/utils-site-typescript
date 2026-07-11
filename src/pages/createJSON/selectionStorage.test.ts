import { describe, expect, it } from "vitest";
import {
  LEGACY_KEY_MAP,
  SELECTION_KEY,
  SELECTION_SCHEMA_KEY,
  SELECTION_SCHEMA_VERSION,
  readSelection,
  writeSelection,
} from "./selectionStorage";
import { getCatalogEntry } from "./exportCatalog";

// Storage-migration fences (2026-07-11 review, Work Package 3C): the Copy Code
// selection key changed meaning from animation-manifest keys to catalog keys.
// These tests cover empty storage, valid new storage, legacy storage,
// duplicates, unknown keys, and unavailable/throwing storage.

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    dump: () => Object.fromEntries(data),
  };
}

describe("selection storage migration", () => {
  it("every legacy map target is a real catalog key", () => {
    const dangling = Object.entries(LEGACY_KEY_MAP)
      .flatMap(([oldKey, targets]) =>
        targets.filter((t) => !getCatalogEntry(t)).map((t) => `${oldKey} → ${t}`)
      );
    expect(dangling).toEqual([]);
  });

  it("empty storage reads as an empty selection and stamps the schema", () => {
    const storage = fakeStorage();
    expect(readSelection(storage)).toEqual([]);
    expect(storage.getItem(SELECTION_SCHEMA_KEY)).toBe(SELECTION_SCHEMA_VERSION);
  });

  it("valid new-schema storage reads back unchanged without rewriting", () => {
    const storage = fakeStorage({
      [SELECTION_KEY]: "lerp,clamp,easeOutBounce",
      [SELECTION_SCHEMA_KEY]: SELECTION_SCHEMA_VERSION,
    });
    expect(readSelection(storage)).toEqual(["lerp", "clamp", "easeOutBounce"]);
    expect(storage.getItem(SELECTION_KEY)).toBe("lerp,clamp,easeOutBounce");
  });

  it("legacy animation keys migrate to catalog keys and persist once", () => {
    const storage = fakeStorage({
      [SELECTION_KEY]: "EasingAnimation,LerpAnimation,CircleToCircleCollision",
    });
    expect(readSelection(storage)).toEqual(["easeInOut", "lerp", "circleCircle"]);
    expect(storage.getItem(SELECTION_KEY)).toBe("easeInOut,lerp,circleCircle");
    expect(storage.getItem(SELECTION_SCHEMA_KEY)).toBe(SELECTION_SCHEMA_VERSION);
    // Second read is a plain read — no re-migration surprises.
    expect(readSelection(storage)).toEqual(["easeInOut", "lerp", "circleCircle"]);
  });

  it("duplicates collapse and unknown keys drop during migration", () => {
    const storage = fakeStorage({
      [SELECTION_KEY]:
        "lerp,LerpAnimation,LerpScalarAnimation,totallyUnknownKey,lerp",
    });
    expect(readSelection(storage)).toEqual(["lerp"]);
  });

  it("mixed legacy + already-canonical keys migrate without selecting extras", () => {
    const storage = fakeStorage({
      [SELECTION_KEY]: "clamp,ColorFamiliesAnimation",
    });
    expect(readSelection(storage)).toEqual(["clamp", "colorFamily"]);
  });

  it("unavailable storage reads as empty and writes are no-ops", () => {
    expect(readSelection(null)).toEqual([]);
    expect(() => writeSelection(["lerp"], null)).not.toThrow();
  });

  it("a throwing storage backend never crashes selection reads or writes", () => {
    const throwing = {
      getItem: () => {
        throw new Error("quota");
      },
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {
        throw new Error("quota");
      },
    };
    expect(readSelection(throwing)).toEqual([]);
    expect(() => writeSelection(["lerp"], throwing)).not.toThrow();
  });

  it("writeSelection dedupes and stamps the schema version", () => {
    const storage = fakeStorage();
    writeSelection(["lerp", "lerp", "clamp"], storage);
    expect(storage.getItem(SELECTION_KEY)).toBe("lerp,clamp");
    expect(storage.getItem(SELECTION_SCHEMA_KEY)).toBe(SELECTION_SCHEMA_VERSION);
  });
});
