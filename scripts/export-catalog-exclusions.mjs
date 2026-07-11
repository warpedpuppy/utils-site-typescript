// Hand-authored exclusion map for the Copy Code export catalog (Work Package 3
// of the 2026-07-11 code review remediation). Every @utilspalooza/core root
// export that is NOT a standalone copyable snippet must appear here with a
// non-empty reason; the catalog test enforces that the union of catalog keys
// and these exclusions covers core-api.json exactly.
//
// Type-only exports (kind "type" in core-api.json) are excluded automatically
// by the generator with a standard reason — they have no runtime snippet. The
// entries below are the value exports that stay npm-install-only.

export const EXPORT_CATALOG_EXCLUSIONS = {
  ticker:
    "requestAnimationFrame scheduler with environment fallbacks (the ONE " +
    "deliberate clock exception in core) — a lifecycle convenience for " +
    "package consumers, not a standalone math snippet.",
  Flock:
    "Stateful convenience class wrapping boidsStep with its own RNG-seeded " +
    "flock state — install @utilspalooza/core to use it; the copyable math " +
    "is boidsStep itself.",
};
