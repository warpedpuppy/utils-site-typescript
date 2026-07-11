import { describe, expect, it } from "vitest";
import { CODEPEN_GALLERY } from "./pens";
import { ALL_RECORDS } from "../../registry";
import { runPen } from "./codepenRuntimeTestHarness";

// The VM-boot smoke-test allowlist, now DERIVED from the registry's `pen` field
// (the completed registry-consolidation work). This is intentionally narrower than the
// sync test's identity set: it is exactly the pens whose serialized runtime is
// known to boot cleanly under a bare VM stub — the "canonical-vm-tested" tier.
// The "canonical" tier (identity-checked but not VM-booted) is deliberately
// excluded, with runtime caveats documented in
// archived Studio canonicalization checklist.
const CANONICAL_DRAW_PEN_KEYS = new Set(
  ALL_RECORDS.filter((r) => r.pen === "canonical-vm-tested").map((r) => r.slug)
);

describe("canonicalized CodePen payloads boot without startup exceptions", () => {
  it("runs every completed canonical pen without missing serialized helpers", () => {
    const failures: string[] = [];

    for (const pen of CODEPEN_GALLERY) {
      if (!CANONICAL_DRAW_PEN_KEYS.has(pen.key)) continue;

      try {
        runPen(pen.payload.js);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${pen.key}: ${message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
