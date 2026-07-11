import { AnimationManifest, CATEGORY_ORDER, RegistryRecord } from "./types";
import { MOTION_EASING } from "./categories/motionEasing";
import { TRIG_ANGLES_VECTORS } from "./categories/trigAnglesVectors";
import { COLLISION_DETECTION } from "./categories/collisionDetection";
import { NUMBERS_IN_MOTION } from "./categories/numbersInMotion";
import { GEOMETRY_SHAPES } from "./categories/geometryShapes";
import { GENERATIVE_SHOWPIECES } from "./categories/generativeShowpieces";
import { HANDY_HELPERS } from "./categories/handyHelpers";

// Concatenated in CATEGORY_ORDER so the derived manifest reproduces today's
// sidebar order exactly. Never import from ../animationManifest here.
export const ALL_RECORDS: RegistryRecord[] = [
  ...MOTION_EASING,
  ...TRIG_ANGLES_VECTORS,
  ...COLLISION_DETECTION,
  ...NUMBERS_IN_MOTION,
  ...GEOMETRY_SHAPES,
  ...GENERATIVE_SHOWPIECES,
  ...HANDY_HELPERS,
];

/** Rebuilds the exact legacy manifest shape from the records. */
export function buildManifest(): AnimationManifest {
  const manifest: AnimationManifest = {};
  for (const cat of CATEGORY_ORDER) manifest[cat] = {};
  for (const r of ALL_RECORDS) {
    manifest[r.category][r.manifestKey] = {
      title: r.title,
      slug: r.slug,
      ...(r.include === false ? { include: false } : {}),
      formula: r.formula,
      load: r.load,
      primaryCoreExport: r.primaryCoreExport,
    };
  }
  return manifest;
}
