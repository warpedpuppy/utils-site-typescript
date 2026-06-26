import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import coreApi from "./core-api.json";
import "./ApiDocs.scss";

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

const coreGroups = [
  {
    title: "Core Math",
    imports: `import { lerp, clamp, mapRange, pingPong } from "@utilspalooza/core";`,
    body:
      "Small scalar helpers for turning time, input, scroll, or distance into useful animation values.",
    items: ["lerp", "inverseLerp", "mapRange", "clamp", "wrap", "pingPong", "smoothstep", "smootherstep"],
  },
  {
    title: "Motion",
    imports: `import { ticker, tweenObject, springValue, yoyo } from "@utilspalooza/core";`,
    body:
      "Tiny time-driven helpers. They sample motion; they do not own your rendering layer.",
    items: ["ticker", "tweenValue", "tweenObject", "tweenFrame", "springValue", "loop", "yoyo", "delay", "stagger"],
  },
  {
    title: "Geometry And Collision",
    imports: `import { distance, circleToRect, vecReflect } from "@utilspalooza/core";`,
    body:
      "Pure functions for points, lines, rectangles, circles, polygons, and 2D vectors.",
    items: ["distance", "lineLength", "getPointOnLine", "circleToCircle", "circleToRect", "lineToLine", "polygonToPolygon", "vecReflect"],
  },
  {
    title: "Legacy",
    imports: `import { centerOnStage, legacyCosWave } from "@utilspalooza/core/legacy";`,
    body:
      "Older migration helpers are deliberately isolated so the root API stays curated.",
    items: ["centerOnStage", "distanceAndAngle", "legacyCosWave", "randomHex", "shuffle", "lineIntersectCircle"],
  },
];

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

function Overview() {
  return (
    <>
      <section className="api-docs__section">
        <div className="api-docs__section-head">
          <h2>Core Package</h2>
          <p>Root imports are the stable public contract.</p>
        </div>
        <div className="api-docs__grid">
          {coreGroups.map((group) => (
            <article className="api-docs__card" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.body}</p>
              <pre><code>{group.imports}</code></pre>
              <div className="api-docs__chips">
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="api-docs__section">
        <div className="api-docs__section-head">
          <h2>Effects Package</h2>
          <p>These create canvases, run animation loops, and return lifecycle handles.</p>
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

function Documentation() {
  const [query, setQuery] = useState("");

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
        <p className="api-docs__eyebrow">npm API</p>
        <h1>Use the math directly. Mount the pretty effects deliberately.</h1>
        <p>
          The final npm shape should keep pure math in <code>@utilspalooza/core</code>,
          old migration utilities in <code>@utilspalooza/core/legacy</code>, and
          canvas site effects in <code>@utilspalooza/effects</code>.
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

      {tab === "overview" ? <Overview /> : <Documentation />}
    </main>
  );
}

export default ApiDocs;
