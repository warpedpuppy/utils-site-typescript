import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import CopyInstall from "../../components/CopyInstall/CopyInstall";
import {
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
      <EntryVisual entry={entry} />
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

function ApiDocs() {
  const { tab, query, pickFunction, setTab, setDocumentationQuery, jumpToConcept } =
    useApiDocsNavigation();

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
        />
      )}
    </main>
  );
}

export default ApiDocs;
