import { Helmet } from "react-helmet-async";
import "./ApiDocs.scss";

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

function ApiDocs() {
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
    </main>
  );
}

export default ApiDocs;
