// The /api "Overview" tab: concept cards (click a chip → the reference,
// pre-filtered) and the preview of the planned @utilspalooza/effects surface.
// Pure layout, fed by conceptGroups from apiModel.
import type { SyntheticEvent } from "react";
import { apiEntries, conceptGroups, CONCEPT_PREFIX } from "./apiModel";
import { getEntryUsageLead, getModuleDocMode } from "./docsManifest";

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

// Chip tooltips are CSS-positioned (centered above the chip), which lets edge
// chips push them off-screen on narrow viewports. On reveal, measure the tip at
// its natural position and shift it back inside the viewport via a CSS var.
const CHIP_TIP_VIEWPORT_PAD = 10;
function clampChipTip(event: SyntheticEvent<HTMLButtonElement>) {
  const tip = event.currentTarget.querySelector<HTMLElement>(".api-docs__chip-tip");
  if (!tip) return;
  tip.style.removeProperty("--chip-tip-shift");
  const rect = tip.getBoundingClientRect();
  let shift = 0;
  if (rect.left < CHIP_TIP_VIEWPORT_PAD) {
    shift = CHIP_TIP_VIEWPORT_PAD - rect.left;
  } else if (rect.right > window.innerWidth - CHIP_TIP_VIEWPORT_PAD) {
    shift = window.innerWidth - CHIP_TIP_VIEWPORT_PAD - rect.right;
  }
  if (shift !== 0) tip.style.setProperty("--chip-tip-shift", `${Math.round(shift)}px`);
}

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
              <p className="api-docs__card-count">
                {group.items.length} function{group.items.length === 1 ? "" : "s"}
              </p>
              <div className="api-docs__chips">
                {group.items.map((item) => {
                  const tipId = `chip-tip-${item.module}-${item.name}`;
                  return (
                    <button
                      type="button"
                      key={`${item.module}.${item.name}`}
                      onClick={() => onPick(item.name, group.id)}
                      onMouseEnter={clampChipTip}
                      onFocus={clampChipTip}
                      aria-describedby={tipId}
                      className={
                        getModuleDocMode(item.module) === "guide"
                          ? "api-docs__chip api-docs__chip--guide"
                          : "api-docs__chip"
                      }
                    >
                      {item.name}
                      <span className="api-docs__chip-tip" role="tooltip" id={tipId}>
                        {getEntryUsageLead(item)}
                      </span>
                    </button>
                  );
                })}
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
