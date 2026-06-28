import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import coreApi from "./core-api.json";
import MiniDemo, { MiniDemoProps } from "../../components/MiniDemo/MiniDemo";
import EasingMiniDemo from "../../components/MiniDemo/EasingMiniDemo";
import InteractiveMiniDemo from "../../components/MiniDemo/InteractiveMiniDemo";
import AnimateMiniDemo from "../../components/MiniDemo/AnimateMiniDemo";
import ColorMiniDemo from "../../components/MiniDemo/ColorMiniDemo";
import ConstructiveGeometryDemo from "../../components/MiniDemo/ConstructiveGeometryDemo";
import { INTERACTIVE_DEMOS } from "../../components/MiniDemo/interactiveDemos";
import { ANIMATE_DEMOS } from "../../components/MiniDemo/animateDemos";
import { COLOR_DEMOS } from "../../components/MiniDemo/colorDemos";
import { CONSTRUCTIVE_GEOMETRY_DEMOS } from "../../components/MiniDemo/constructiveGeometryDemos";
import { pingPong } from "@utilspalooza/core/PingPong";
import {
  linear, easeIn, easeOut, easeInOut,
  easeInQuad, easeOutQuad, easeInOutQuad,
  easeInCubic, easeOutCubic, easeInOutCubic,
  easeInQuart, easeOutQuart, easeInOutQuart,
  easeInQuint, easeOutQuint, easeInOutQuint,
  easeOutElastic, easeOutBounce,
} from "@utilspalooza/core/Easing";
import { SCALAR_TRANSFORM_DEMOS } from "../../components/MiniDemo/scalarTransforms";
import {
  CATCH_ALL_CONCEPT,
  CONCEPTS,
  getEntryUsageLead,
  getEntryVisual,
  getModuleDocMode,
  makeConceptId,
  MODULE_ENTRY_ORDER,
  MODULE_GUIDES,
  ModuleDocMode,
} from "./docsManifest";
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
  smootherstep: "smootherstep",
};

const EASING_DEMOS: Record<string, (t: number) => number> = {
  linear, easeIn, easeOut, easeInOut,
  easeInQuad, easeOutQuad, easeInOutQuad,
  easeInCubic, easeOutCubic, easeInOutCubic,
  easeInQuart, easeOutQuart, easeInOutQuart,
  easeInQuint, easeOutQuint, easeInOutQuint,
  easeOutElastic, easeOutBounce,
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
  return [...groups.entries()].map(([module, list]) => [module, sortModuleEntries(module, list)]);
}

function sortModuleEntries(module: string, entries: ApiEntry[]): ApiEntry[] {
  const preferredOrder = MODULE_ENTRY_ORDER[module];
  if (!preferredOrder) return entries;
  const rank = new Map(preferredOrder.map((name, index) => [name, index]));
  return [...entries].sort((a, b) => {
    const aRank = rank.get(a.name) ?? Number.MAX_SAFE_INTEGER;
    const bRank = rank.get(b.name) ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  });
}

function renderImportLine(entry: ApiEntry): string {
  if (entry.kind === "type") {
    return `import type { ${entry.name} } from "@utilspalooza/core";`;
  }
  return `import { ${entry.name} } from "@utilspalooza/core";`;
}

function renderEntryMeta(entry: ApiEntry, mode: ModuleDocMode) {
  const guide = MODULE_GUIDES[entry.module];
  return (
    <div className="api-docs__entry-meta">
      <span className={`api-docs__kind api-docs__kind--${entry.kind}`}>{entry.kind}</span>
      {mode === "guide" && guide && <span className="api-docs__role">{guide.badgeLabel}</span>}
    </div>
  );
}

function ApiEntryCard({
  entry,
  mode,
  onJumpToConcept,
}: {
  entry: ApiEntry;
  mode: ModuleDocMode;
  onJumpToConcept: (conceptId: string) => void;
}) {
  const concept = getConceptForModule(entry.module);
  const visual = getEntryVisual(entry.name);
  const geometryDemo = CONSTRUCTIVE_GEOMETRY_DEMOS[entry.name];
  return (
    <article className="api-docs__fn" key={`${entry.module}.${entry.name}`} id={entry.name}>
      <div className="api-docs__fn-head">
        <code className="api-docs__fn-name">{entry.name}</code>
        {renderEntryMeta(entry, mode)}
      </div>
      {concept && (
        <div className="api-docs__crumbs">
          <button type="button" onClick={() => onJumpToConcept(concept.id)}>
            Overview
          </button>
          <span>/</span>
          <button type="button" onClick={() => onJumpToConcept(concept.id)}>
            {concept.title}
          </button>
        </div>
      )}
      {mode === "guide" && <p className="api-docs__usage-lead">{getEntryUsageLead(entry)}</p>}
      <pre className="api-docs__fn-sig">
        <code>{renderImportLine(entry)}</code>
      </pre>
      <pre className="api-docs__fn-sig">
        <code>{`${entry.name}${entry.kind === "type" ? "" : `: ${entry.signature}`}`}</code>
      </pre>
      {entry.description && <p>{cleanDoc(entry.description)}</p>}
      {visual.kind === "mini-demo" && EASING_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">See it move:</p>
          <EasingMiniDemo ease={EASING_DEMOS[entry.name]} label={`${entry.name}(t)`} height={200} />
        </>
      )}
      {visual.kind === "mini-demo" && INTERACTIVE_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">Play with the arguments:</p>
          <InteractiveMiniDemo demo={INTERACTIVE_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "mini-demo" && ANIMATE_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">Sample the timeline:</p>
          <AnimateMiniDemo demo={ANIMATE_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "mini-demo" && COLOR_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">
            {entry.name === "sphereLighting" ? "Drag the light:" : "See the conversion:"}
          </p>
          <ColorMiniDemo demo={COLOR_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "mini-demo" && geometryDemo && (
        <>
          <p className="api-docs__demo-caption">Drag the scene:</p>
          <ConstructiveGeometryDemo demo={geometryDemo} />
        </>
      )}
      {visual.kind === "mini-demo" && !INTERACTIVE_DEMOS[entry.name] && MINI_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">See it move:</p>
          <MiniDemo {...MINI_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "example" && visual.exampleSlug && (
        <div className="api-docs__example-callout">
          <p>See it in a richer canvas example:</p>
          <Link
            to={`/examples/${visual.exampleSlug}`}
            state={{ fromApi: true, fnName: entry.name }}
          >
            {visual.exampleLabel ?? "Open the example"}
          </Link>
        </div>
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
  );
}


function countConceptModulesByMode(entries: ApiEntry[]) {
  const seen = new Map<string, ModuleDocMode>();
  for (const entry of entries) {
    if (!seen.has(entry.module)) {
      seen.set(entry.module, getModuleDocMode(entry.module));
    }
  }

  let systemGuideModules = 0;
  let conceptSetModules = 0;
  let referenceModules = 0;
  for (const [module, mode] of seen.entries()) {
    if (mode === "guide") {
      const guideKind = MODULE_GUIDES[module]?.guideKind;
      if (guideKind === "system") systemGuideModules += 1;
      else conceptSetModules += 1;
      continue;
    }
    referenceModules += 1;
  }

  return { systemGuideModules, conceptSetModules, referenceModules };
}

// Build concept groups straight from the generated docs data. Each concept lists
// every export whose source module it claims; anything unclaimed is collected
// into the catch-all so nothing the package exports is ever hidden here.
function buildConceptGroups(): {
  id: string;
  title: string;
  blurb: string;
  items: ApiEntry[];
  systemGuideModules: number;
  conceptSetModules: number;
  referenceModules: number;
}[] {
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
    id: makeConceptId(concept.title),
    title: concept.title,
    blurb: concept.blurb,
    items: buckets[i],
    ...countConceptModulesByMode(buckets[i]),
  })).filter((g) => g.items.length > 0);

  if (leftovers.length > 0) {
    groups.push({
      id: makeConceptId(CATCH_ALL_CONCEPT.title),
      ...CATCH_ALL_CONCEPT,
      items: leftovers,
      ...countConceptModulesByMode(leftovers),
    });
  }
  return groups;
}

const conceptGroups = buildConceptGroups();
const conceptByModule = new Map(
  conceptGroups.flatMap((group) =>
    [...new Set(group.items.map((entry) => entry.module))].map((module) => [module, group] as const),
  ),
);

function getConceptForModule(module: string) {
  return conceptByModule.get(module);
}

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

function Overview({ onPick }: { onPick: (name: string, conceptId: string) => void }) {
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
  onJumpToConcept,
}: {
  query: string;
  setQuery: (value: string) => void;
  onJumpToConcept: (conceptId: string) => void;
}) {
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? apiEntries.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q),
        )
      : apiEntries;
    return groupByModule(filtered);
  }, [query]);

  const total = apiEntries.length;
  const shown = groups.reduce((n, [, list]) => n + list.length, 0);
  const visibleEntryNames = useMemo(
    () => new Set(groups.flatMap(([, entries]) => entries.map((entry) => entry.name))),
    [groups],
  );

  return (
    <section className="api-docs__section">
      <div className="api-docs__section-head">
        <h2>Function Reference</h2>
        <p>
          Generated from the source JSDoc. Pure functions still read like a normal
          reference; the handful of bigger systems are documented from the top down
          so you can see how to use them before reading every member.
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
          {MODULE_GUIDES[module] && (
            <article className="api-docs__guide">
              <div className="api-docs__guide-head">
                <h4>{MODULE_GUIDES[module]!.title}</h4>
                <span>start here</span>
              </div>
              <p>{MODULE_GUIDES[module]!.whatItIs}</p>
              <p>{MODULE_GUIDES[module]!.howToStart}</p>
              <pre className="api-docs__fn-sig">
                <code>{MODULE_GUIDES[module]!.importSnippet}</code>
              </pre>
              <div className="api-docs__guide-pieces">
                {MODULE_GUIDES[module]!.keyPieceNames
                  .filter((name) => visibleEntryNames.has(name))
                  .map((name) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => document.getElementById(name)?.scrollIntoView({ block: "start" })}
                    >
                      {name}
                    </button>
                  ))}
              </div>
            </article>
          )}
          {entries.map((entry) => (
            <ApiEntryCard
              key={`${entry.module}.${entry.name}`}
              entry={entry}
              mode={getModuleDocMode(module)}
              onJumpToConcept={onJumpToConcept}
            />
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
const OVERVIEW_SCROLL_KEY = "api-docs:overview-scroll-y";
const CONCEPT_PREFIX = "concept-";

function isTabId(value: string | null): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

function getTabFromSearch(search: string): TabId {
  const value = new URLSearchParams(search).get("tab");
  return isTabId(value) ? value : "overview";
}

function ApiDocs() {
  const navigate = useNavigate();
  const location = useLocation();
  const tab = getTabFromSearch(location.search);
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const lastTabRef = useRef<TabId | null>(null);
  const overviewScrollRef = useRef(0);
  const pendingDocTargetRef = useRef<string | null>(searchParams.get("fn"));
  const pendingOverviewConceptRef = useRef<string | null>(searchParams.get("concept"));

  const saveOverviewScroll = () => {
    overviewScrollRef.current = window.scrollY;
    sessionStorage.setItem(OVERVIEW_SCROLL_KEY, String(window.scrollY));
  };

  const restoreOverviewScroll = () => {
    const saved =
      overviewScrollRef.current ||
      Number(sessionStorage.getItem(OVERVIEW_SCROLL_KEY) ?? "0");
    window.scrollTo({ top: Number.isFinite(saved) ? saved : 0, behavior: "auto" });
  };

  const scrollConceptIntoView = (conceptId: string) => {
    document.getElementById(`${CONCEPT_PREFIX}${conceptId}`)?.scrollIntoView({
      block: "start",
    });
  };

  const updateSearch = (
    nextTab: TabId,
    nextQuery = "",
    nextFn?: string,
    nextConcept?: string,
    replace = false,
  ) => {
    const params = new URLSearchParams();
    if (nextTab !== "overview") params.set("tab", nextTab);
    const trimmedQuery = nextQuery.trim();
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (nextFn) params.set("fn", nextFn);
    if (nextConcept) params.set("concept", nextConcept);
    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace },
    );
  };

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    setQuery((current) => (current === nextQuery ? current : nextQuery));
    pendingDocTargetRef.current = searchParams.get("fn");
    pendingOverviewConceptRef.current = searchParams.get("concept");
  }, [searchParams]);

  useLayoutEffect(() => {
    const previousTab = lastTabRef.current;
    if (tab === previousTab) return;

    if (tab === "overview") {
      requestAnimationFrame(() => {
        const conceptId = pendingOverviewConceptRef.current;
        if (conceptId) {
          scrollConceptIntoView(conceptId);
        } else if (previousTab !== null) {
          restoreOverviewScroll();
        }
      });
    } else {
      requestAnimationFrame(() => {
        const target = pendingDocTargetRef.current;
        if (target) {
          document.getElementById(target)?.scrollIntoView({ block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      });
    }

    lastTabRef.current = tab;
  }, [tab]);

  // A concept chip on the Overview jumps to the reference, pre-filtered to that
  // export, and scrolls it into view once the Documentation tab has rendered.
  const pickFunction = (name: string, conceptId: string) => {
    saveOverviewScroll();
    setQuery(name);
    pendingDocTargetRef.current = name;
    pendingOverviewConceptRef.current = conceptId;
    updateSearch("documentation", name, name, conceptId);
  };

  const setTab = (nextTab: TabId) => {
    if (nextTab === tab) return;
    if (tab === "overview") saveOverviewScroll();
    if (nextTab === "overview") {
      pendingDocTargetRef.current = null;
      pendingOverviewConceptRef.current = null;
      updateSearch("overview");
      return;
    }
    updateSearch("documentation", query, undefined, pendingOverviewConceptRef.current ?? undefined);
  };

  const setDocumentationQuery = (value: string) => {
    setQuery(value);
    pendingDocTargetRef.current = null;
    updateSearch(
      "documentation",
      value,
      undefined,
      pendingOverviewConceptRef.current ?? undefined,
      true,
    );
  };

  const jumpToConcept = (conceptId: string) => {
    pendingDocTargetRef.current = null;
    pendingOverviewConceptRef.current = conceptId;
    updateSearch("overview", "", undefined, conceptId);
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
        <Documentation
          query={query}
          setQuery={setDocumentationQuery}
          onJumpToConcept={jumpToConcept}
        />
      )}
    </main>
  );
}

export default ApiDocs;
