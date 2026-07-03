// The /api "Overview" tab: concept cards (click a chip → the reference,
// pre-filtered) and the preview of the planned @utilspalooza/effects surface.
// Pure layout, fed by conceptGroups from apiModel.
import { apiEntries, conceptGroups, CONCEPT_PREFIX } from "./apiModel";
import { getModuleDocMode } from "./docsManifest";

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

export function Overview({ onPick }: { onPick: (name: string, conceptId: string) => void }) {
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
            <article
              className="api-docs__card"
              key={group.title}
              id={`${CONCEPT_PREFIX}${group.id}`}
            >
              <h3>{group.title}</h3>
              <p>{group.blurb}</p>
              <div className="api-docs__card-meta">
                <span>{group.referenceModules} reference module{group.referenceModules === 1 ? "" : "s"}</span>
                {group.systemGuideModules > 0 && (
                  <span>
                    {group.systemGuideModules} system guide
                    {group.systemGuideModules === 1 ? "" : "s"}
                  </span>
                )}
                {group.conceptSetModules > 0 && (
                  <span>
                    {group.conceptSetModules} concept set
                    {group.conceptSetModules === 1 ? "" : "s"}
                  </span>
                )}
              </div>
              <div className="api-docs__chips">
                {group.items.map((item) => (
                  <button
                    type="button"
                    key={`${item.module}.${item.name}`}
                    onClick={() => onPick(item.name, group.id)}
                    title={`Open ${item.name} in the reference`}
                    className={
                      getModuleDocMode(item.module) === "guide"
                        ? "api-docs__chip api-docs__chip--guide"
                        : "api-docs__chip"
                    }
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
            The same math, composed into drop-in canvas pieces. This is the
            planned follow-on package surface: each effect creates a canvas,
            runs its own loop, and hands back a lifecycle handle.
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
