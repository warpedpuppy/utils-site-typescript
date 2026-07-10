import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AmbientConceptCanvas from "../../components/AmbientConceptCanvas/AmbientConceptCanvas";
import CopyInstall from "../../components/CopyInstall/CopyInstall";
import LazyMount from "../../components/LazyMount/LazyMount";
import {
  CORE_LICENSE,
  CORE_VERSION,
  GITHUB_URL,
  NPM_URL,
} from "../../packageMeta";
import { getExamplesForExport } from "../../registry/exampleCoreLinks";
import {
  getEntryIntro,
  getEntryTabs,
  getEntryUsageLead,
  getEntryPanelSize,
  getEntryVisual,
  getModuleDocMode,
  MODULE_GUIDES,
  ModuleDocMode,
} from "./docsManifest";
import {
  ApiEntry,
  apiEntries,
  cleanDoc,
  comicDisplayTitle,
  getChapterForModule,
  getChapterNumber,
  getConceptForModule,
  getTeachingIndex,
  groupByConcept,
  renderImportLine,
  teachingOrderEntries,
} from "./apiModel";
import { EntryVisual } from "./docsVisuals";
import { Overview } from "./ApiOverview";
import { TABS, useApiDocsNavigation } from "./useApiDocsNavigation";
import "./ApiDocs.scss";

function renderEntryMeta(entry: ApiEntry, mode: ModuleDocMode) {
  const guide = MODULE_GUIDES[entry.module];
  return (
    <div className="api-docs__entry-meta">
      {/* "function" is the default case for ~87% of exports — flagging it on
          every issue is taxonomy noise. Only const/type are worth calling out. */}
      {entry.kind !== "function" && (
        <span className={`api-docs__kind api-docs__kind--${entry.kind}`}>{entry.kind}</span>
      )}
      {mode === "guide" && guide && <span className="api-docs__role">{guide.badgeLabel}</span>}
    </div>
  );
}

// The rich-altitude handoff: every documented function that some /examples
// animation teaches gets a live back-link to it, straight from the intro tab.
// Registry-driven (getExamplesForExport), so it covers functions that also have
// a docs mini-demo — the visual tab's own "example" callout only fires for
// functions with NO docs cut, so this is the complete cross-link, not a dupe.
function EntryExampleLinks({ entry }: { entry: ApiEntry }) {
  const examples = getExamplesForExport(entry.name);
  if (examples.length === 0) return null;
  return (
    <section className="api-docs__example-callout api-docs__example-callout--intro">
      <p>{examples.length === 1 ? "See it move in a full example:" : "See it move in full examples:"}</p>
      <div className="api-docs__example-links">
        {examples.map((example) => (
          <Link
            key={example.slug}
            to={`/examples/${example.slug}`}
            state={{ fromApi: true, fnName: entry.name }}
          >
            {example.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

function EntryExplainPanel({
  entry,
  onFocusFunction,
}: {
  entry: ApiEntry;
  onFocusFunction: (name: string) => void;
}) {
  const intro = getEntryIntro(entry);
  return (
    <div className="api-docs__entry-panel">
      <div className="api-docs__teaching-grid">
        <section className="api-docs__teaching-block">
          <h3>In Plain English</h3>
          <p>{intro.whatItIs}</p>
        </section>
        <section className="api-docs__teaching-block">
          <h3>When You'd Use It</h3>
          <p>{intro.howToUse}</p>
        </section>
      </div>

      {intro.related.length > 0 && (
        <section className="api-docs__related">
          <h3>You Might Also Want</h3>
          <div className="api-docs__related-list">
            {intro.related.map((related) => (
              <button
                type="button"
                key={`${entry.name}-${related.name}`}
                className="api-docs__related-item"
                onClick={() => onFocusFunction(related.name)}
              >
                <code>{related.name}</code>
                <span>{related.reason}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EntryVisualPanel({ entry }: { entry: ApiEntry }) {
  // No usage-lead line here: on the issue view the lead is the masthead
  // subtitle, directly above this panel — printing it twice reads as a stutter.
  return (
    <div className="api-docs__entry-panel">
      {/* Demos mount only near the viewport. minHeight approximates the block's
          real height (canvas demo vs. small example callout) so scroll stays stable. */}
      <LazyMount minHeight={getEntryVisual(entry.name).kind === "mini-demo" ? 360 : 90}>
        <EntryVisual entry={entry} />
      </LazyMount>
      <EntryExampleLinks entry={entry} />
    </div>
  );
}

function EntryReferencePanel({ entry }: { entry: ApiEntry }) {
  return (
    <div className="api-docs__entry-panel">
      <pre className="api-docs__fn-sig">
        <code>{renderImportLine(entry)}</code>
      </pre>
      <pre className="api-docs__fn-sig">
        <code>{`${entry.name}${entry.kind === "type" ? "" : `: ${entry.signature}`}`}</code>
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
    </div>
  );
}

function EntryTabs({
  entry,
  onFocusFunction,
}: {
  entry: ApiEntry;
  onFocusFunction: (name: string) => void;
}) {
  const tabs = getEntryTabs(entry);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "intro");
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const panelId = `${entry.name}-${activeTab.id}-panel`;

  return (
    <>
      <nav className="api-docs__entry-tabs" aria-label={`${entry.name} sections`} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={`${entry.name}-${tab.id}`}
              id={`${entry.name}-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${entry.name}-${tab.id}-panel`}
              className={isActive ? "api-docs__entry-tab active" : "api-docs__entry-tab"}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${entry.name}-${activeTab.id}-tab`}
        className="api-docs__entry-tabpanel"
      >
        {activeTab.panel === "intro" && (
          <EntryExplainPanel entry={entry} onFocusFunction={onFocusFunction} />
        )}
        {activeTab.panel === "visual" && <EntryVisualPanel entry={entry} />}
        {activeTab.panel === "reference" && <EntryReferencePanel entry={entry} />}
      </div>
    </>
  );
}

// A single export presented as a full comic issue: animated masthead in its
// chapter's colorway, comic-lettered title, the usage lead as the cover
// subtitle, then the unchanged three-tab anatomy (See It Move / Explain It /
// Code & Details). This is the ?fn= takeover view — the newsstand's tiles,
// Overview chips, related buttons, and external deep links all land here.
function IssueView({
  entry,
  onJumpToConcept,
  onFocusFunction,
  onBackToRack,
}: {
  entry: ApiEntry;
  onJumpToConcept: (conceptId: string) => void;
  onFocusFunction: (name: string) => void;
  onBackToRack: () => void;
}) {
  const concept = getConceptForModule(entry.module);
  const issueIndex = getTeachingIndex(entry.name);
  const isLast = issueIndex === teachingOrderEntries.length - 1;
  const next = teachingOrderEntries[(issueIndex + 1) % teachingOrderEntries.length];
  // The graphic-novel page-turn: when the next issue opens a new chapter, the
  // footer carries the outgoing chapter's narrator hand-off as the bridge.
  const chapter = getChapterForModule(entry.module);
  const nextChapter = getChapterForModule(next.module);
  const turnsChapter = !isLast && chapter && nextChapter && chapter.id !== nextChapter.id;
  // Phase 4 pacing: splash issues open like a double-page spread, compact ones
  // like a one-pager. All three sizes keep the full three-tab anatomy.
  const panelSize = getEntryPanelSize(entry);

  // Turning to another issue (tile, related button, NEXT ISSUE) presents it
  // from the top like a page turn, and hands focus to the article so keyboard
  // readers aren't stranded on an unmounted control.
  useEffect(() => {
    const article = document.getElementById(entry.name);
    article?.scrollIntoView({ block: "start" });
    article?.focus({ preventScroll: true });
  }, [entry.name]);

  return (
    <article
      className={`api-docs__issue api-docs__issue--${panelSize}`}
      id={entry.name}
      tabIndex={-1}
    >
      <header className="api-docs__issue-masthead">
        <div className="api-docs__issue-art" aria-hidden="true">
          {concept && <AmbientConceptCanvas conceptId={concept.id} />}
        </div>
        <div className="api-docs__issue-masthead-inner">
          <div className="api-docs__issue-topline">
            <button type="button" className="api-docs__issue-back" onClick={onBackToRack}>
              ← Back to the rack
            </button>
            <span className="api-docs__issue-badge">
              <span>issue</span>
              <strong>№{issueIndex + 1}</strong>
              <span>of {teachingOrderEntries.length}</span>
            </span>
          </div>
          <h3 className="api-docs__issue-title">{comicDisplayTitle(entry.name)}</h3>
          <div className="api-docs__issue-meta">
            <code className="api-docs__fn-name">{entry.name}</code>
            {renderEntryMeta(entry, getModuleDocMode(entry.module))}
          </div>
          <p className="api-docs__issue-subtitle">{getEntryUsageLead(entry)}</p>
        </div>
      </header>
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
      <EntryTabs entry={entry} onFocusFunction={onFocusFunction} />
      <footer className="api-docs__next-issue">
        {turnsChapter && chapter.handoff && (
          <p className="api-docs__handoff">{chapter.handoff}</p>
        )}
        <button type="button" onClick={() => onFocusFunction(next.name)}>
          <span>
            {isLast
              ? "That's the whole run — start over…"
              : turnsChapter
                ? `New chapter — ${nextChapter.title}…`
                : "Next issue…"}
          </span>
          <strong>{comicDisplayTitle(next.name)}!</strong>
          <em>{getEntryUsageLead(next)}</em>
        </button>
      </footer>
    </article>
  );
}

// Tile accents rotate through the comic primaries by chapter, like cover
// stripes on a shelf of the same imprint.
const TILE_ACCENTS = ["red", "blue", "yellow"] as const;

function Documentation({
  query,
  setQuery,
  fnTarget,
  onJumpToConcept,
  onFocusFunction,
  onExpandFunction,
}: {
  query: string;
  setQuery: (value: string) => void;
  fnTarget: string | null;
  onJumpToConcept: (conceptId: string) => void;
  onFocusFunction: (name: string) => void;
  onExpandFunction: (name: string) => void;
}) {
  // The Full Reference is a newsstand: chapter covers up top (the rack), then
  // one shelf per chapter holding every export as a small issue-cover tile.
  // Opening a tile — or arriving with ?fn= from a chip, related button, or an
  // external link — takes over the tab with that entry as a full comic issue.
  // A search query hides the rack and filters the shelves' tiles.
  const chapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? apiEntries.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.module.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q),
        )
      : apiEntries;
    return groupByConcept(filtered);
  }, [query]);

  const isFiltering = query.trim() !== "";
  const total = apiEntries.length;
  const shown = chapters.reduce(
    (n, chapter) => n + chapter.moduleGroups.reduce((m, [, list]) => m + list.length, 0),
    0,
  );
  const visibleEntryNames = useMemo(
    () =>
      new Set(
        chapters.flatMap((chapter) =>
          chapter.moduleGroups.flatMap(([, entries]) => entries.map((entry) => entry.name)),
        ),
      ),
    [chapters],
  );

  const issueEntry = fnTarget
    ? apiEntries.find((entry) => entry.name === fnTarget)
    : undefined;

  if (issueEntry) {
    return (
      <section className="api-docs__section">
        <IssueView
          entry={issueEntry}
          onJumpToConcept={onJumpToConcept}
          onFocusFunction={onFocusFunction}
          // Clearing the query clears ?fn= with it — one hop back to the rack
          // even when the issue was reached through a pre-filtered chip click.
          onBackToRack={() => setQuery("")}
        />
      </section>
    );
  }

  return (
    <section className="api-docs__section api-docs__newsstand">
      <div className="api-docs__section-head">
        <h2>Function Reference</h2>
        <p>
          Racked like a newsstand: ten chapters in teaching order, every function its
          own issue. Pick a cover and it opens the whole story — see the math move,
          understand it, take the code. Or type a name below to jump straight there.
        </p>
      </div>

      <div className="api-docs__filter">
        <input
          type="search"
          className="api-docs__search"
          placeholder={`Looking for someone? Filter ${total} functions…`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter API functions"
        />
        <p className="api-docs__count">
          Showing {shown} of {total} functions
        </p>
      </div>

      {!isFiltering && (
        <div className="api-docs__rack" aria-label="Chapters">
          {chapters.map((chapter) => (
            <a className="api-docs__cover" href={`#shelf-${chapter.id}`} key={chapter.id}>
              <div className="api-docs__cover-art">
                <LazyMount minHeight={118}>
                  <AmbientConceptCanvas conceptId={chapter.id} />
                </LazyMount>
              </div>
              <div className="api-docs__cover-no">CH.{getChapterNumber(chapter.id)}</div>
              <div className="api-docs__cover-body">
                <div className="api-docs__cover-title">{chapter.title}</div>
                <div className="api-docs__cover-count">
                  {chapter.moduleGroups.reduce((n, [, list]) => n + list.length, 0)} issues
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {chapters.map((chapter) => {
        const chapterNo = getChapterNumber(chapter.id);
        const accent = TILE_ACCENTS[(chapterNo - 1) % TILE_ACCENTS.length];
        return (
          <section className="api-docs__shelf" id={`shelf-${chapter.id}`} key={chapter.id}>
            <header className="api-docs__shelf-head">
              <span className="api-docs__shelf-no">CH.{chapterNo}</span>
              <h3>{chapter.title}</h3>
            </header>
            <p className="api-docs__shelf-blurb">{chapter.blurb}</p>
            {chapter.moduleGroups.map(
              ([module]) =>
                MODULE_GUIDES[module] && (
                  <article className="api-docs__guide" key={module}>
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
                          <button type="button" key={name} onClick={() => onFocusFunction(name)}>
                            {name}
                          </button>
                        ))}
                    </div>
                  </article>
                ),
            )}
            <div className="api-docs__tile-grid">
              {chapter.moduleGroups.flatMap(([module, entries]) =>
                entries.map((entry) => {
                  // Splash flagships rack face-out: a double-wide featured
                  // cover with the comic title, so the shelf has headliners.
                  const featured = getEntryPanelSize(entry) === "splash";
                  return (
                    <button
                      type="button"
                      key={`${module}.${entry.name}`}
                      className={`api-docs__tile api-docs__tile--${accent}${featured ? " api-docs__tile--featured" : ""}`}
                      onClick={() => onExpandFunction(entry.name)}
                    >
                      <span className="api-docs__tile-strip" aria-hidden="true" />
                      {featured && (
                        <span className="api-docs__tile-flash" aria-hidden="true">
                          ★ feature
                        </span>
                      )}
                      <span className="api-docs__tile-body">
                        {featured && (
                          <span className="api-docs__tile-feature-title">
                            {comicDisplayTitle(entry.name)}
                          </span>
                        )}
                        <span className="api-docs__tile-topline">
                          <code>{entry.name}</code>
                          {entry.kind !== "function" && (
                            <span className="api-docs__tile-kind">{entry.kind}</span>
                          )}
                        </span>
                        <span className="api-docs__tile-lead">{getEntryUsageLead(entry)}</span>
                      </span>
                    </button>
                  );
                }),
              )}
            </div>
            {/* The narrator's page-turn to the next shelf. Hidden while
                filtering: a partial shelf's "next chapter" may not be shown. */}
            {!isFiltering && chapter.handoff && (
              <p className="api-docs__handoff api-docs__handoff--shelf">{chapter.handoff}</p>
            )}
          </section>
        );
      })}

      {shown === 0 && (
        <p className="api-docs__empty">
          Nobody by the name “{query}” on this rack — check the spelling.
        </p>
      )}
    </section>
  );
}

function ApiDocs() {
  const {
    tab,
    query,
    fnTarget,
    pickFunction,
    focusFunction,
    expandFunction,
    setTab,
    setDocumentationQuery,
    jumpToConcept,
  } = useApiDocsNavigation();

  return (
    <main className="api-docs">
      <Helmet>
        <title>API Docs — Utilspalooza</title>
        <meta
          name="description"
          content="Reference the Utilspalooza core math helpers, legacy imports, and easy canvas effects API."
        />
        <link rel="canonical" href="https://utilspalooza.com/api" />
        <meta property="og:url" content="https://utilspalooza.com/api" />
        <meta property="og:title" content="API Docs — Utilspalooza" />
      </Helmet>

      <section className="api-docs__intro">
        <p className="api-docs__eyebrow">the library behind the lessons</p>
        <h1>See the math that makes things move.</h1>
        <p>
          Every animation on this site comes apart into small, nameable pieces of
          math — a lerp, an easing curve, a vector reflection. This is that toolbox:
          pure functions in <code>@utilspalooza/core</code>, published on npm. (A
          companion effects package that composes these primitives into finished
          canvas effects is in the works.) Read it to understand the idea, then
          take the code.
        </p>
        <CopyInstall />
        <p className="api-docs__badges">
          <a
            className="api-docs__badge"
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            v{CORE_VERSION} on npm ↗
          </a>
          <span className="api-docs__badge">{CORE_LICENSE} license</span>
          <a
            className="api-docs__badge"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            source on GitHub ↗
          </a>
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
          fnTarget={fnTarget}
          onJumpToConcept={jumpToConcept}
          onFocusFunction={focusFunction}
          onExpandFunction={expandFunction}
        />
      )}
    </main>
  );
}

export default ApiDocs;
