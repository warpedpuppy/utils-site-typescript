// Compatibility shim. The manifest is now derived from the per-animation
// registry records in src/registry/. This file keeps its historic default
// export (the manifest object) and its two type exports so every existing
// consumer — Examples.tsx, CreateJSON.tsx, CreateChecklists.tsx, SiteData.ts,
// the studio tests — keeps importing `animationManifest` exactly as before.
// To add or change an animation, edit the registry records, not this file.
export type {
  AnimationManifestEntry,
  AnimationManifest,
} from "./registry/types";

import { buildManifest } from "./registry";

const animationManifest = buildManifest();

export default animationManifest;
