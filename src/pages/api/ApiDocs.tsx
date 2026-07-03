import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import CopyInstall from "../../components/CopyInstall/CopyInstall";
import {
  getEntryIntro,
  getEntryTabs,
  getEntryUsageLead,
  getModuleDocMode,
  MODULE_GUIDES,
  ModuleDocMode,
} from "./docsManifest";
import {
  ApiEntry,
  apiEntries,
  cleanDoc,
  getConceptForModule,
  groupByModule,
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

function EntryIntroPanel({
  entry,
  onFocusFunction,
}: {
  entry: ApiEntry;
  onFocusFunction: (name: string) => void;
}) {
  const intro = getEntryIntro(entry);
  return (
    <div className="api-docs__entry-panel">
      <p className="api-docs__usage-lead">{getEntryUsageLead(entry)}</p>

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

      <div className="api-docs__teaching-grid">
        <section className="api-docs__teaching-block">
          <h3>Grab It Like This</h3>
          <pre className="api-docs__fn-sig">
            <code>{renderImportLine(entry)}</code>
          </pre>
        </section>
        {entry.example && (
          <section className="api-docs__teaching-block">
            <h3>Starter Example</h3>
            <pre className="api-docs__fn-example">
              <code>{entry.example}</code>
            </pre>
          </section>
        )}
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
          <EntryIntroPanel entry={entry} onFocusFunction={onFocusFunction} />
        )}
        {activeTab.panel === "visual" && <EntryVisual entry={entry} />}
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
}: {
  entry: ApiEntry;
  mode: ModuleDocMode;
  onJumpToConcept: (conceptId: string) => void;
  onFocusFunction: (name: string) => void;
}) {
  const concept = getConceptForModule(entry.module);
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
      <EntryTabs entry={entry} onFocusFunction={onFocusFunction} />
    </article>
  );
}

function Documentation({
  query,
  setQuery,
  onJumpToConcept,
  onFocusFunction,
}: {
  query: string;
  setQuery: (value: string) => void;
  onJumpToConcept: (conceptId: string) => void;
  onFocusFunction: (name: string) => void;
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
  const visibleEntryNames = useMemo(
    () => new Set(groups.flatMap(([, entries]) => entries.map((entry) => entry.name))),
    [groups],
  );

  return (
    <section className="api-docs__section">
      <div className="api-docs__section-head">
        <h2>Function Reference</h2>
        <p>
          Every export now opens as a small teaching surface: plain-language intro,
          dedicated motion/example tab, then the raw signature and params. Change the
          query when you want to compare siblings or narrow to one tool.
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
                    <button type="button" key={name} onClick={() => onFocusFunction(name)}>
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
              onFocusFunction={onFocusFunction}
            />
          ))}
        </div>
      ))}

      {shown === 0 && <p className="api-docs__empty">No exports match “{query}”.</p>}
    </section>
  );
}

function ApiDocs() {
  const {
    tab,
    query,
    pickFunction,
    focusFunction,
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
          pure functions in <code>@utilspalooza/core</code>, the same primitives
          eventually composed into finished canvas effects in <code>@utilspalooza/effects</code>.
          Read it to understand the idea, then take the code.
        </p>
        <CopyInstall />
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
          onFocusFunction={focusFunction}
        />
      )}
    </main>
  );
}

export default ApiDocs;
