import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import coreApi from "./core-api.json";
import MiniDemo, { MiniDemoProps } from "../../components/MiniDemo/MiniDemo";
import { pingPong } from "@utilspalooza/core/PingPong";
import { SCALAR_TRANSFORM_DEMOS } from "../../components/MiniDemo/scalarTransforms";
import "./ApiDocs.scss";

// ── Mini-demos ───────────────────────────────────────────────────────────────
// Docs-altitude visuals for the scalar primitives: a core function name → the
// live two-pane demo that shows what it actually does. The SAME drawing + (for
// transforms) the SAME input sweep back the /examples animation, so the two
// pages cannot drift (CLAUDE.md, "Docs are friendly, visual, and ELI5").
//
// pingPong is a generator (one number, `fn` path); the rest are transforms keyed
// by their core export name, driven by the shared SCALAR_TRANSFORM_DEMOS registry
// (input → output via the `sample` path).
const TRANSFORM_FN_NAMES: Record<string, string> = {
  lerp: "lerp",
  "inverse-lerp": "inverseLerp",
  "map-range": "mapRange",
  clamp: "clamp",
  wrap: "wrap",
  smoothstep: "smoothstep",
};

const MINI_DEMOS: Record<string, MiniDemoProps> = {
  pingPong: { fn: pingPong, length: 100, label: "pingPong(t, 100)" },
};

for (const demo of SCALAR_TRANSFORM_DEMOS) {
  MINI_DEMOS[TRANSFORM_FN_NAMES[demo.slug]] = {
    sample: demo.sample,
    length: demo.length,
    label: demo.label,
    inputMin: demo.inputMin,
    inputMax: demo.inputMax,
  };
}

interface ApiEntry {
  name: string;
  kind: "function" | "const" | "type";
  module: string;
  signature: string;
  description: string;
  params: { name: string; text: string }[];
  returns: string;
  example: string;
}

const apiEntries = coreApi as ApiEntry[];

// JSDoc descriptions may contain inline {@link name} tags — render them as plain text.
function cleanDoc(text: string): string {
  return text.replace(/\{@link\s+([^}]+)\}/g, (_m, ref) => ref.trim());
}

// Preserve the source order (alphabetical by module, then name) while grouping.
function groupByModule(entries: ApiEntry[]): [string, ApiEntry[]][] {
  const groups = new Map<string, ApiEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.module) ?? [];
    list.push(entry);
    groups.set(entry.module, list);
  }
  return [...groups.entries()];
}

// ── Teaching map ────────────────────────────────────────────────────────────
// The ONLY hand-maintained part of the Overview: which source modules belong to
// which "concept" a learner would recognise, and one sentence on what the
// concept teaches. Everything else below is derived from core-api.json, so
// adding a function to the library makes it appear here automatically — a new
// module nobody has slotted yet falls into the "More core math" catch-all rather
// than vanishing. Order is pedagogical: foundations first, systems last.
const CONCEPTS: { title: string; blurb: string; modules: string[] }[] = [
  {
    title: "Numbers in motion",
    blurb:
      "The scalar building blocks: turn time, input, or distance into a usable value. Almost every animation downstream is just these, repeated.",
    modules: ["Lerp", "InverseLerp", "MapRange", "Clamp", "Wrap", "PingPong", "Smoothstep"],
  },
  {
    title: "Easing & tweening",
    blurb:
      "Why motion feels alive instead of robotic. The curves that shape acceleration, plus tiny time-driven helpers that sample them — they move values, never your render layer.",
    modules: ["Easing", "Animate"],
  },
  {
    title: "Angles & trigonometry",
    blurb:
      "Where sine and cosine stop being homework and become rotation, orbits, and waves. Degrees, radians, and the unit circle, made visible.",
    modules: [
      "AngleInterpolation", "DegToRad", "RadToDeg", "UnitCirclePoint",
      "GetRotation", "SineCurve", "SineWave", "WaveAmplitude", "DFT",
    ],
  },
  {
    title: "Vectors",
    blurb:
      "How anything that moves knows where it is going. Add, scale, rotate, reflect, normalize — the grammar of position and velocity in 2D.",
    modules: ["Vec2"],
  },
  {
    title: "Points, lines & curves",
    blurb:
      "The geometry under shapes and paths: distances, points along a line, triangle math, Bézier curves, and placing things evenly around a circle.",
    modules: [
      "Distance", "LineLength", "GetPointOnLine", "MoveAlongLine", "MoveToward",
      "GetTriangleData", "CircleFromThreePoints", "FindPointAroundCircle",
      "DistributeAroundCircle", "EquilateralTriangle", "Rectangle", "Star",
      "QuadraticBezier", "BezierCurve",
    ],
  },
  {
    title: "Collision detection",
    blurb:
      "The question every game asks: are these two things touching? Circles, rectangles, lines, points, and polygons, in every combination.",
    modules: [
      "CircleToCircle", "CircleToRect", "LineToCircle", "LineToLine",
      "LineToPoint", "LineToRect", "PointToCircle", "PointToRect",
      "PolygonToPolygon", "RectToRect",
      "CollisionObjectAPI/CircleCircle", "CollisionObjectAPI/LineCircle",
      "CollisionObjectAPI/LineLine", "CollisionObjectAPI/LinePoint",
      "CollisionObjectAPI/PointCircle", "CollisionObjectAPI/PolygonCircle",
      "CollisionObjectAPI/PolygonLine", "CollisionObjectAPI/PolygonPoint",
      "CollisionObjectAPI/PolygonPolygon",
    ],
  },
  {
    title: "Color",
    blurb:
      "Color as math you can interpolate. Convert between RGB and HSL, blend two colors, and build palettes that actually go together.",
    modules: ["Color", "GetRandomColors"],
  },
  {
    title: "Physics & systems",
    blurb:
      "Where simple rules produce complex, lifelike behavior: bouncing, orbits, flocking, gravity, lensing, and cellular automata.",
    modules: [
      "Boids", "BallBounce", "BallToBallBounce", "OrbitalMotion",
      "GameOfLife", "GRStep", "LensDeflection", "SphereLighting",
    ],
  },
  {
    title: "Helpers",
    blurb:
      "The small conveniences every demo needs and nobody wants to rewrite: random numbers, number formatting, centering on a parent.",
    modules: ["RandomIntegerBetween", "RandomNumberBetween", "NumberWithCommas", "CenterOnParent"],
  },
  {
    title: "Core types",
    blurb:
      "The shared shapes — Point, Circle, Line, Polygon, Vector — that the whole library speaks in.",
    modules: ["types"],
  },
];

const CATCH_ALL = {
  title: "More core math",
  blurb: "Recently added to the package and not yet slotted into a concept above.",
};

// Build concept groups straight from the generated docs data. Each concept lists
// every export whose source module it claims; anything unclaimed is collected
// into the catch-all so nothing the package exports is ever hidden here.
function buildConceptGroups(): { title: string; blurb: string; items: ApiEntry[] }[] {
  const moduleToConcept = new Map<string, number>();
  CONCEPTS.forEach((concept, i) => {
    for (const mod of concept.modules) moduleToConcept.set(mod, i);
  });

  const buckets: ApiEntry[][] = CONCEPTS.map(() => []);
  const leftovers: ApiEntry[] = [];
  for (const entry of apiEntries) {
    const i = moduleToConcept.get(entry.module);
    if (i === undefined) leftovers.push(entry);
    else buckets[i].push(entry);
  }

  const groups = CONCEPTS.map((concept, i) => ({
    title: concept.title,
    blurb: concept.blurb,
    items: buckets[i],
  })).filter((g) => g.items.length > 0);

  if (leftovers.length > 0) {
    groups.push({ ...CATCH_ALL, items: leftovers });
  }
  return groups;
}

const conceptGroups = buildConceptGroups();

const effects = [
  {
    title: "Glitter",
    mount: "mountGlitter",
    note: "A field of glow dots and radial beams driven by cosine oscillators.",
  },
  {
    title: "Pretty Ring",
    mount: "mountPrettyRing",
    note: "Layered radial placement, wobble, additive glow, and pointer pulse.",
  },
  {
    title: "Sparklies",
    mount: "mountSparklies",
    note: "Small fireworks built from rotated local beam coordinates.",
  },
  {
    title: "Klimt",
    mount: "mountKlimt",
    note: "Tip-to-tail rectangle ribbons using local-coordinate stepping.",
  },
];

function Overview({ onPick }: { onPick: (name: string) => void }) {
  const total = apiEntries.length;
  return (
    <>
      <section className="api-docs__section">
        <div className="api-docs__section-head">
          <h2>The math beneath the animation</h2>
          <p>
            {total} functions, grouped by the idea they teach — not by file. Every
            one is a pure, typed, tested piece of the math that makes a thing move.
            Pick a concept, then click any name to read its full signature, params,
            and a runnable example.
          </p>
        </div>
        <div className="api-docs__grid">
          {conceptGroups.map((group) => (
            <article className="api-docs__card" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.blurb}</p>
              <div className="api-docs__chips">
                {group.items.map((item) => (
                  <button
                    type="button"
                    key={`${item.module}.${item.name}`}
                    onClick={() => onPick(item.name)}
                    title={`Open ${item.name} in the reference`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="api-docs__section">
        <div className="api-docs__section-head">
          <h2>From primitives to finished effects</h2>
          <p>
            The same math, composed into drop-in canvas pieces. Each one creates a
            canvas, runs its own loop, and hands back a lifecycle handle — proof of
            what the building blocks above add up to.
          </p>
        </div>
        <pre className="api-docs__wide-code"><code>{`import { mountGlitter } from "@utilspalooza/effects";

const effect = mountGlitter("#hero", {
  density: 0.8,
  interactive: true,
  seed: 23,
});

effect.pause();
effect.resume();
effect.resize();
effect.destroy();`}</code></pre>
        <div className="api-docs__grid api-docs__grid--effects">
          {effects.map((effect) => (
            <article className="api-docs__effect" key={effect.mount}>
              <h3>{effect.title}</h3>
              <code>{effect.mount}</code>
              <p>{effect.note}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Documentation({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? apiEntries.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.module.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q),
        )
      : apiEntries;
    return groupByModule(filtered);
  }, [query]);

  const total = apiEntries.length;
  const shown = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <section className="api-docs__section">
      <div className="api-docs__section-head">
        <h2>Function Reference</h2>
        <p>
          Generated from the source JSDoc — every <code>@utilspalooza/core</code>{" "}
          export, always complete.
        </p>
      </div>

      <div className="api-docs__filter">
        <input
          type="search"
          className="api-docs__search"
          placeholder={`Filter ${total} exports by name, module, or description…`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter API functions"
        />
        <p className="api-docs__count">
          {shown} of {total} exports
        </p>
      </div>

      {groups.map(([module, entries]) => (
        <div className="api-docs__module" key={module}>
          <h3 className="api-docs__module-title">{module}</h3>
          {entries.map((entry) => (
            <article
              className="api-docs__fn"
              key={`${entry.module}.${entry.name}`}
              id={entry.name}
            >
              <div className="api-docs__fn-head">
                <code className="api-docs__fn-name">{entry.name}</code>
                <span className={`api-docs__kind api-docs__kind--${entry.kind}`}>
                  {entry.kind}
                </span>
              </div>
              <pre className="api-docs__fn-sig">
                <code>{`${entry.name}${
                  entry.kind === "type" ? "" : `: ${entry.signature}`
                }`}</code>
              </pre>
              {entry.description && <p>{cleanDoc(entry.description)}</p>}
              {MINI_DEMOS[entry.name] && (
                <>
                  <p className="api-docs__demo-caption">See it move:</p>
                  <MiniDemo {...MINI_DEMOS[entry.name]} />
                </>
              )}
              {entry.params.length > 0 && (
                <dl className="api-docs__params">
                  {entry.params.map((param) => (
                    <div key={param.name}>
                      <dt>{param.name}</dt>
                      <dd>{cleanDoc(param.text)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {entry.returns && (
                <p className="api-docs__returns">
                  <span>returns</span> {cleanDoc(entry.returns)}
                </p>
              )}
              {entry.example && (
                <pre className="api-docs__fn-example">
                  <code>{entry.example}</code>
                </pre>
              )}
            </article>
          ))}
        </div>
      ))}

      {shown === 0 && <p className="api-docs__empty">No exports match “{query}”.</p>}
    </section>
  );
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "documentation", label: "Documentation" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ApiDocs() {
  const [tab, setTab] = useState<TabId>("overview");
  const [query, setQuery] = useState("");

  // A concept chip on the Overview jumps to the reference, pre-filtered to that
  // export, and scrolls it into view once the Documentation tab has rendered.
  const pickFunction = (name: string) => {
    setQuery(name);
    setTab("documentation");
    requestAnimationFrame(() => {
      document.getElementById(name)?.scrollIntoView({ block: "start" });
    });
  };

  return (
    <main className="api-docs">
      <Helmet>
        <title>API Docs — Utilspalooza</title>
        <meta
          name="description"
          content="Reference the Utilspalooza core math helpers, legacy imports, and easy canvas effects API."
        />
        <link rel="canonical" href="https://utilspalooza.com/api" />
      </Helmet>

      <section className="api-docs__intro">
        <p className="api-docs__eyebrow">the library behind the lessons</p>
        <h1>See the math that makes things move.</h1>
        <p>
          Every animation on this site comes apart into small, nameable pieces of
          math — a lerp, an easing curve, a vector reflection. This is that toolbox:
          pure functions in <code>@utilspalooza/core</code>, the same primitives
          composed into finished canvas effects in <code>@utilspalooza/effects</code>.
          Read it to understand the idea, then take the code.
        </p>
      </section>

      <nav className="api-docs__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            className={`api-docs__tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <Overview onPick={pickFunction} />
      ) : (
        <Documentation query={query} setQuery={setQuery} />
      )}
    </main>
  );
}

export default ApiDocs;
