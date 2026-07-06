import { describe, expect, it } from "vitest";
import animationManifest from "../../animationManifest";
import { getKeyAndInnerKeyFromSlug } from "./ExamplesUtils";

function resolvedSlug(exampleSlug: string) {
  const { returnKey, returnInnerKey } = getKeyAndInnerKeyFromSlug(
    animationManifest,
    exampleSlug
  );

  if (!returnKey || !returnInnerKey) return "";
  return animationManifest[returnKey][returnInnerKey].slug;
}

describe("Examples route matching", () => {
  it("matches complete slugs instead of substring hits", () => {
    for (const slug of [
      "color-lerp",
      "inverse-lerp",
      "lerp",
      "lerp-smooth-follow",
    ]) {
      expect(resolvedSlug(slug)).toBe(slug);
    }
  });
});
