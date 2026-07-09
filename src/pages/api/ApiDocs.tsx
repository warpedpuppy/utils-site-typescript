import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  getEntryVisual,
  getModuleDocMode,
  MODULE_GUIDES,
  ModuleDocMode,
} from "./docsManifest";
import {
  ApiEntry,
  apiEntries,
  cleanDoc,
  getConceptForModule,
  groupByConcept,
  renderImportLine,
} from "./apiModel";
import { EntryVisual } from "./docsVisuals";
import { Overview } from "./ApiOverview";
import { TABS, useApiDocsNavigation } from "./useApiDocsNavigation";
import "./ApiDocs.scss";

function renderEntryMeta(entry: ApiEntry, mode: ModuleDocMode) {
  const guide = MODULE_GUIDES[entry.module];
  return (
    <div className="api-docs__entry-meta">
      <span className={`api-docs__kind api-docs__kind--${entry.kind}`}>{entry.kind}</span>
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
  return (
    <div className="api-docs__entry-panel">
      <p className="api-docs__usage-lead">{getEntryUsageLead(entry)}</p>
      {/* Demos mount only near the viewport — with every entry expanded this page
          otherwise runs ~79 rAF canvases at once. minHeight approximates the block's
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

function ApiEntryCard({
  entry,
  mode,
  onJumpToConcept,
  onFocusFunction,
  onCollapse,
}: {
  entry: ApiEntry;
  mode: ModuleDocMode;
  onJumpToConcept: (conceptId: string) => void;
  onFocusFunction: (name: string) => void;
  // Present only when the card was expanded from a table-of-contents row —
  // search results and deep-filtered views stay plain cards with no close button.
  onCollapse?: () => void;
}) {
  const concept = getConceptForModule(entry.module);
  return (
    <article
      className="api-docs__fn"
      key={`${entry.module}.${entry.name}`}
      id={entry.name}
      tabIndex={-1}
    >
      <div className="api-docs__fn-head">
        <code className="api-docs__fn-name">{entry.name}</code>
        <div className="api-docs__fn-head-side">
          {renderEntryMeta(entry, mode)}
          {onCollapse && (
            <button
              type="button"
              className="api-docs__fn-collapse"
              onClick={onCollapse}
              aria-label={`Collapse ${entry.name} back to the chapter index`}
            >
              close
            </button>
          )}
        </div>
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
      <EntryTabs entry={entry} onFocusFunction={onFocusFunction} />
    </article>
  );
}

function Documentation({
  query,
  setQuery,
  fnTarget,
  onJumpToConcept,
  onFocusFunction,
  onExpandFunction,
  onCollapseFunction,
}: {
  query: string;
  setQuery: (value: string) => void;
  fnTarget: string | null;
  onJumpToConcept: (conceptId: string) => void;
  onFocusFunction: (name: string) => void;
  onExpandFunction: (name: string) => void;
  onCollapseFunction: () => void;
}) {
  // With no filter, the reference is a table of contents: chapters list their
  // entries as compact rows (name + one-line lead) that expand in place. Rows
  // the reader has opened live in local state; the ?fn= target is always merged
  // in so deep links land on a fully expanded entry inside the book. A search
  // query switches to full cards for every match — today's behavior.
  const isIndexView = query.trim() === "";
  const [openedNames, setOpenedNames] = useState<Set<string>>(() => new Set());
  const expandedNames = useMemo(() => {
    if (!fnTarget) return openedNames;
    const merged = new Set(openedNames);
    merged.add(fnTarget);
    return merged;
  }, [openedNames, fnTarget]);

  const expandEntry = (name: string) => {
    setOpenedNames((prev) => new Set(prev).add(name));
    onExpandFunction(name);
    // The row unmounts under the keyboard user's focus; hand focus to the card.
    requestAnimationFrame(() => document.getElementById(name)?.focus());
  };

  const collapseEntry = (name: string) => {
    setOpenedNames((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
    if (name === fnTarget) onCollapseFunction();
    requestAnimationFrame(() => document.getElementById(`toc-${name}`)?.focus());
  };

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

  return (
    <section className="api-docs__section">
      <div className="api-docs__section-head">
        <h2>Function Reference</h2>
        <p>
          Read it like a book — short chapters, each building on the last, from plain
          numbers all the way to physics systems. Open any entry and it explains itself,
          shows its math moving, and hands you the real signature. Or type a name below
          to jump straight to one function.
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

      {chapters.map((chapter) => (
        <section
          className={`api-docs__chapter${isIndexView ? " api-docs__chapter--index" : ""}`}
          key={chapter.id}
        >
          <header className="api-docs__chapter-head">
            <h3>{chapter.title}</h3>
            <p>{chapter.blurb}</p>
          </header>
          {chapter.moduleGroups.map(([module, entries]) => (
            <div className="api-docs__module" key={module}>
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
                        <button type="button" key={name} onClick={() => onFocusFunction(name)}>
                          {name}
                        </button>
                      ))}
                  </div>
                </article>
              )}
              {entries.map((entry) =>
                isIndexView && !expandedNames.has(entry.name) ? (
                  <button
                    type="button"
                    key={`${entry.module}.${entry.name}`}
                    id={`toc-${entry.name}`}
                    className="api-docs__toc-row"
                    onClick={() => expandEntry(entry.name)}
                  >
                    <code>{entry.name}</code>
                    <span>{getEntryUsageLead(entry)}</span>
                  </button>
                ) : (
                  <ApiEntryCard
                    key={`${entry.module}.${entry.name}`}
                    entry={entry}
                    mode={getModuleDocMode(module)}
                    onJumpToConcept={onJumpToConcept}
                    onFocusFunction={onFocusFunction}
                    onCollapse={isIndexView ? () => collapseEntry(entry.name) : undefined}
                  />
                ),
              )}
            </div>
          ))}
        </section>
      ))}

      {shown === 0 && <p className="api-docs__empty">No exports match “{query}”.</p>}
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
    collapseFunction,
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
          onCollapseFunction={collapseFunction}
        />
      )}
    </main>
  );
}

export default ApiDocs;
