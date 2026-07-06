import { RegistryRecord } from "../types";

import { BoidsObject } from "../../pages/createJSON/formulas/animation/Boids";
import {
  FlowFieldFormula,
  FourierFormula,
  GameOfLifeFormula,
  GlitterFormula,
  KlimtFormula,
  LensingFormula,
  PhyllotaxisFormula,
  PrecessionFormula,
  PrettyRingFormula,
  SierpinskiFormula,
  SparkliesFormula,
  WaveFormula,
} from "../../animationExtraFormulas";

// Several showpieces are "pure": their math (Perlin noise, the golden angle,
// midpoint subdivision, tip-to-tail bricks) has no @utilspalooza/core export to
// teach, and the effects-backed ones (Glitter/PrettyRing/Sparklies) teach
// @utilspalooza/effects exports, not core. Those records carry coreExports: []
// on purpose — see Edward's 2026-07-02 registry-consolidation ruling.
export const GENERATIVE_SHOWPIECES: RegistryRecord[] = [
  {
    slug: "fourier-epicycles",
    title: "Fourier epicycles",
    category: "generative showpieces",
    manifestKey: "FourierEpicycles",
    formula: FourierFormula,
    load: () => import("../../core-animations/FourierEpicycles"),
    coreExports: ["dft"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "game-of-life",
    title: "Conway's Game of Life",
    category: "generative showpieces",
    manifestKey: "GameOfLife",
    formula: GameOfLifeFormula,
    load: () => import("../../core-animations/GameOfLife"),
    coreExports: ["gameOfLifeStep"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "flow-field",
    title: "Perlin noise flow field",
    category: "generative showpieces",
    manifestKey: "FlowField",
    formula: FlowFieldFormula,
    load: () => import("../../core-animations/FlowField"),
    // Pure showpiece: inline Perlin noise, no @utilspalooza/core export to teach.
    coreExports: [],
    pen: "canonical-vm-tested",
  },
  {
    slug: "wave-interference",
    title: "Wave interference",
    category: "generative showpieces",
    manifestKey: "WaveInterference",
    formula: WaveFormula,
    load: () => import("../../core-animations/WaveInterference"),
    coreExports: ["waveAmplitude"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "gravitational-lensing",
    title: "Gravitational lensing",
    category: "generative showpieces",
    manifestKey: "GravitationalLensing",
    formula: LensingFormula,
    load: () => import("../../core-animations/GravitationalLensing"),
    coreExports: ["lensDeflection"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "orbital-precession",
    title: "Orbital precession (GR)",
    category: "generative showpieces",
    manifestKey: "OrbitalPrecession",
    formula: PrecessionFormula,
    load: () => import("../../core-animations/OrbitalPrecession"),
    coreExports: ["grStep", "gravitationalStep"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "phyllotaxis",
    title: "Phyllotaxis (golden angle)",
    category: "generative showpieces",
    manifestKey: "Phyllotaxis",
    formula: PhyllotaxisFormula,
    load: () => import("../../core-animations/Phyllotaxis"),
    // Pure showpiece: inline golden-angle placement, no core export to teach.
    coreExports: [],
    pen: "canonical-vm-tested",
  },
  {
    slug: "murmuration",
    title: "Murmuration (flocking starlings)",
    category: "generative showpieces",
    manifestKey: "Murmuration",
    formula: BoidsObject,
    load: () => import("../../core-animations/Murmuration"),
    coreExports: ["boidsStep"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "sierpinski",
    title: "Sierpinski Triangle",
    category: "generative showpieces",
    manifestKey: "Sierpinski",
    formula: SierpinskiFormula,
    load: () => import("../../core-animations/Sierpinski"),
    // Pure showpiece: inline midpoint subdivision, no core export to teach.
    coreExports: [],
    pen: "canonical-vm-tested",
  },
  {
    slug: "glitter",
    title: "Glitter",
    category: "generative showpieces",
    manifestKey: "Glitter",
    formula: GlitterFormula,
    load: () => import("../../core-animations/Glitter"),
    // Effects-backed showpiece: teaches @utilspalooza/effects (cosWave), not core.
    coreExports: [],
    pen: "effects-mount",
  },
  {
    slug: "pretty-ring",
    title: "Pretty Ring",
    category: "generative showpieces",
    manifestKey: "PrettyRing",
    formula: PrettyRingFormula,
    load: () => import("../../core-animations/PrettyRing"),
    // Effects-backed showpiece: teaches @utilspalooza/effects (cosWave), not core.
    coreExports: [],
    pen: "effects-mount",
  },
  {
    slug: "sparklies",
    title: "Sparklies",
    category: "generative showpieces",
    manifestKey: "Sparklies",
    formula: SparkliesFormula,
    load: () => import("../../core-animations/Sparklies"),
    // Effects-backed showpiece: teaches @utilspalooza/effects (sparklyBeamPoint), not core.
    coreExports: [],
    pen: "effects-mount",
  },
  {
    slug: "klimt",
    title: "Klimt-Inspired Swirls",
    category: "generative showpieces",
    manifestKey: "Klimt",
    formula: KlimtFormula,
    load: () => import("../../core-animations/Klimt"),
    // Pure showpiece: inline tip-to-tail brick placement, no core export to teach.
    coreExports: [],
    pen: "canonical-vm-tested",
  },
];
