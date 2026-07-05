// The Studio advanced-project manifest. Studio.tsx renders this list; it must
// never re-accumulate per-project knowledge inline (see the Iron-Rules Studio
// note in CLAUDE.md). To add a project: create its module in this directory,
// export its class + canonical CodePenPayload, and register it here.
import AudioVisualizerWireframe, {
  AUDIO_VISUALIZER_PEN,
} from "./AudioVisualizerWireframe";
import GenerativeLogoTracer, {
  GENERATIVE_LOGO_TRACER_PEN,
} from "./GenerativeLogoTracer";
import OrganicTerrainMap, {
  ORGANIC_TERRAIN_MAP_PEN,
} from "./OrganicTerrainMap";
import ParticleConstellation, {
  PARTICLE_CONSTELLATION_PEN,
} from "./ParticleConstellation";
import PhysicsToy, { PHYSICS_TOY_PEN } from "./PhysicsToy";
import GenerativeWallpaper, {
  GENERATIVE_WALLPAPER_PEN,
} from "./GenerativeWallpaper";
import { CodePenPayload } from "./codepen";

export interface FunctionUse {
  name: string;
  fn?: string;
  note: string;
  linePatterns?: string[];
}

export interface StudioProject {
  key: string;
  title: string;
  /** URL segment: /studio/<label> */
  label: string;
  /** "+"-separated math chips shown on the card and workspace header */
  math: string;
  blurb: string;
  ProjectClass: new (canvasCont: any) => any;
  /** Canonical pen payload — also rendered verbatim as the Code tab source */
  codePen: CodePenPayload;
  functionsUsed: FunctionUse[];
}

export const STUDIO_PROJECTS: StudioProject[] = [
  {
    key: "AudioVisualizerWireframe",
    title: AudioVisualizerWireframe.t,
    label: AudioVisualizerWireframe.l,
    math: "Fourier DFT",
    blurb:
      "A circular FFT display built from synthetic sine waves. Swap one line for a real microphone.",
    ProjectClass: AudioVisualizerWireframe,
    codePen: AUDIO_VISUALIZER_PEN,
    functionsUsed: [
      {
        name: "dft",
        fn: "dft",
        note:
          "The visualizer is about the same Fourier idea: split a sound into frequency buckets. In the live-mic path, the browser's AnalyserNode does that FFT work; the site's dft function teaches the same transformation in plain math.",
        linePatterns: ["analyser.getByteFrequencyData", "FFT ·"],
      },
      {
        name: "sineCurve",
        fn: "sineCurve",
        note:
          "Before the mic is turned on, the demo fakes moving audio peaks with sine waves. That gives the renderer something musical-looking to draw immediately.",
        linePatterns: ["Math.sin(t * 0.9)", "Math.sin(t * 1.5", "Math.sin(t * 2.3"],
      },
    ],
  },
  {
    key: "GenerativeLogoTracer",
    title: GenerativeLogoTracer.t,
    label: GenerativeLogoTracer.l,
    math: "Fourier DFT + Bézier",
    blurb:
      "Author a shape as Bézier curves, then watch a chain of rotating circles redraw it. The 'circles' slider is Fourier compression you can see.",
    ProjectClass: GenerativeLogoTracer,
    codePen: GENERATIVE_LOGO_TRACER_PEN,
    functionsUsed: [
      {
        name: "deCasteljau",
        fn: "deCasteljau",
        note:
          "The shape starts as Bezier curves. De Casteljau is the point-finder: ask for 0%, 25%, 50%, and so on along each curve, and you get dots that trace the outline.",
        linePatterns: ["const cubic=", "function sample", "cubic(a,b,c,d"],
      },
      {
        name: "dft",
        fn: "dft",
        note:
          "Those outline dots become Fourier circles. Bigger circles draw the broad shape; smaller circles add the details. The slider changes how many circles are allowed to help.",
        linePatterns: ["function dft", "vectors = dft(pts)", "v.amp*Math.cos"],
      },
    ],
  },
  {
    key: "OrganicTerrainMap",
    title: OrganicTerrainMap.t,
    label: OrganicTerrainMap.l,
    math: "Perlin + marching squares",
    blurb:
      "Fractal noise becomes a tinted heightmap; marching squares traces clean contour lines you can export as SVG.",
    ProjectClass: OrganicTerrainMap,
    codePen: ORGANIC_TERRAIN_MAP_PEN,
    functionsUsed: [
      {
        name: "lerp",
        fn: "lerp",
        note:
          "The contour lines need smooth crossing points between grid corners. Lerp is the plain-English move: 'this far between low and high is where the line should pass.'",
        linePatterns: ["const fade=t", "return lerp(", "const ip="],
      },
      {
        name: "mapRange",
        fn: "mapRange",
        note:
          "The terrain pipeline repeatedly turns one kind of value into another: noise into elevation, elevation into color bands, and elevation thresholds into contour levels.",
        linePatterns: ["function color(e)", "const level=l/levels", "scale = zoom/Math.min"],
      },
    ],
  },
  {
    key: "ParticleConstellation",
    title: ParticleConstellation.t,
    label: ParticleConstellation.l,
    math: "Phyllotaxis + lerp + Perlin",
    blurb:
      "Particles glide from chaos into a golden-angle lattice via eased lerp, then breathe through a Perlin drift field.",
    ProjectClass: ParticleConstellation,
    codePen: PARTICLE_CONSTELLATION_PEN,
    functionsUsed: [
      {
        name: "lerp",
        fn: "lerp",
        note:
          "Every dot has a random starting point and a target point. Lerp gives the in-between position so each dot can travel from chaos into the final pattern.",
        linePatterns: ["const lerp = (a,b,t)", "const baseX = lerp", "const baseY = lerp"],
      },
      {
        name: "easeInOut",
        fn: "easeInOut",
        note:
          "Raw lerp moves like a robot. easeInOut bends time so the particles start gently, move faster in the middle, and settle softly at the end.",
        linePatterns: ["const easeInOut", "const e = easeInOut"],
      },
    ],
  },
  {
    key: "PhysicsToy",
    title: PhysicsToy.t,
    label: PhysicsToy.l,
    math: "Orbital + Bounce + Collision",
    blurb:
      "Gravity, wall bounce, and elastic collision sharing one loop. Zero gravity is billiards; crank it up for a solar system.",
    ProjectClass: PhysicsToy,
    codePen: PHYSICS_TOY_PEN,
    functionsUsed: [
      {
        name: "circleToCircle",
        fn: "circleToCircle",
        note:
          "Each body is a circle. When two circles overlap, the toy separates them and swaps the part of their velocity aimed along the collision line.",
        linePatterns: ["elastic ball-ball collisions", "if(d>0 && d<min)", "const nx=dx/d"],
      },
      {
        name: "ballBounce",
        fn: "ballBounce",
        note:
          "Wall hits use the same bounce idea: reverse the velocity on the axis that hit the wall, then keep a fraction of the speed as restitution.",
        linePatterns: ["const restitution", "// 4) walls", "b.vx=-b.vx*restitution"],
      },
    ],
  },
  {
    key: "GenerativeWallpaper",
    title: GenerativeWallpaper.t,
    label: GenerativeWallpaper.l,
    math: "Bézier + Perlin + color",
    blurb:
      "Bézier petals varied by a Perlin field, clipped per cell so the pattern tiles seamlessly. Download a PNG for any CSS background.",
    ProjectClass: GenerativeWallpaper,
    codePen: GENERATIVE_WALLPAPER_PEN,
    functionsUsed: [
      {
        name: "deCasteljau",
        fn: "deCasteljau",
        note:
          "The petals are Bezier shapes. The canvas uses bezierCurveTo directly here, while deCasteljau is the site's function for understanding how points on those curves are found.",
        linePatterns: ["one Bézier petal", "function petal", "ctx.bezierCurveTo"],
      },
      {
        name: "lerpColor",
        fn: "lerpColor",
        note:
          "The wallpaper changes hue, lightness, and opacity from cell to cell. lerpColor is the reusable version of the same idea: blend between colors instead of jumping abruptly.",
        linePatterns: ["const hue =", "hsla(${hue}", "hsl(${baseHue}"],
      },
    ],
  },
];
