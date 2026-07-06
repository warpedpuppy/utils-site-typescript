import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Studio.scss";
import StudioCanvas from "./StudioCanvas";
import { STUDIO_PROJECTS, FunctionUse, StudioProject } from "./studioProjects";
import { CODEPEN_GALLERY } from "./pens";
import { CodePenPayload, CODEPEN_ENDPOINT } from "./codepen";

type WorkspaceTab = "demo" | "math" | "code";
type SourceTab = "HTML" | "CSS" | "JS";

function sourceBlocks(payload: CodePenPayload) {
  return [
    { label: "HTML", code: payload.html },
    { label: "CSS", code: payload.css },
    { label: "JS", code: payload.js },
  ];
}

function docsHref(fn: string) {
  return `/api?tab=documentation&fn=${encodeURIComponent(fn)}`;
}

function findLineNumbers(code: string, patterns: string[] = []) {
  const lines = code.split("\n");
  return patterns
    .map((pattern) => lines.findIndex((line) => line.includes(pattern)) + 1)
    .filter((lineNumber) => lineNumber > 0);
}

function lineReferenceText(payload: CodePenPayload, item: FunctionUse) {
  const lineNumbers = findLineNumbers(payload.js, item.linePatterns);
  if (!lineNumbers.length) return "";
  const unique = Array.from(new Set(lineNumbers));
  return `JS lines ${unique.join(", ")}`;
}

function Studio() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState<{
    Cls: StudioProject["ProjectClass"];
  } | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("demo");
  const [sourceTab, setSourceTab] = useState<SourceTab>("JS");
  const [selectedPenKey, setSelectedPenKey] = useState(
    CODEPEN_GALLERY[0]?.key ?? "",
  );
  const selectedPen =
    CODEPEN_GALLERY.find((item) => item.key === selectedPenKey) ??
    CODEPEN_GALLERY[0];

  // Handle redirect on initial load
  useEffect(() => {
    // No auto-redirect: a bare /studio shows the gallery landing.
    if (!projectName) setActiveProject(null);
  }, [projectName]);

  // Load project when URL changes
  useEffect(() => {
    if (!projectName) return;

    const project = STUDIO_PROJECTS.find((p) => p.label === projectName);
    if (project) {
      // Wrap in object — React calls bare functions as state updaters (no 'new'), crashing class constructors
      setActiveProject({ Cls: project.ProjectClass });
      setWorkspaceTab("demo");
      setSourceTab("JS");
    } else {
      console.warn(`Project not found: ${projectName}`);
    }
  }, [projectName]);

  function clickHandler(label: string) {
    navigate(`/studio/${label}`);
  }

  const current = STUDIO_PROJECTS.find((p) => p.label === projectName) || null;
  const chips = (math: string) => math.split("+").map((c) => c.trim());
  const currentSource =
    current && sourceBlocks(current.codePen).find((block) => block.label === sourceTab);

  return (
    <section
      id="studio-page"
      className={current ? "in-workspace" : "in-gallery"}
    >
      <Helmet>
        <title>Build With It — Utilspalooza</title>
        <meta
          name="description"
          content="Practical micro-projects showing how to use canvas animations in real code."
        />
        <link rel="canonical" href="https://utilspalooza.com/studio" />
        <meta property="og:url" content="https://utilspalooza.com/studio" />
        <meta property="og:title" content="Build With It — Utilspalooza" />
      </Helmet>

      {!current ? (
        /* ─── Gallery landing ─────────────────────────────────────────── */
        <div id="studio-gallery">
          <header className="gallery-hero">
            <h1>Build With It</h1>
            <p className="hero-tagline">
              The <strong>Examples</strong> section explains the math. This is
              where you use it. Every tile is a small, complete thing you could
              ship — watch it run, read <em>why</em> it's built that way, then
              open it in CodePen and make it yours.
            </p>
          </header>

          <section className="gallery-section">
            <h2 className="gallery-section-label">Tinker in CodePen</h2>
            <p className="gallery-section-sub">
              Pick any animation and open a complete, dependency-free CodePen —
              same math, plain JS, no build step.
            </p>
            <form
              className="codepen-picker-form"
              action={CODEPEN_ENDPOINT}
              method="POST"
              target="_blank"
              rel="noopener noreferrer"
            >
              <input
                type="hidden"
                name="data"
                value={JSON.stringify(
                  selectedPen?.payload ?? CODEPEN_GALLERY[0].payload,
                )}
              />
              <select
                className="codepen-picker-select"
                value={selectedPenKey}
                onChange={(e) => setSelectedPenKey(e.target.value)}
              >
                {(() => {
                  const pensByGroup = CODEPEN_GALLERY.reduce<
                    Record<string, typeof CODEPEN_GALLERY>
                  >((acc, item) => {
                    const g = item.group ?? "Other";
                    (acc[g] ??= []).push(item);
                    return acc;
                  }, {});
                  return Object.entries(pensByGroup).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.label}
                        </option>
                      ))}
                    </optgroup>
                  ));
                })()}
              </select>
              <button type="submit" className="codepen-picker-btn">
                Tinker in CodePen ↗
              </button>
            </form>
          </section>

          <section className="gallery-section">
            <h2 className="gallery-section-label">Advanced Examples</h2>
            <p className="gallery-section-sub">
              Interactive demos that compose this site's math into something
              real.
            </p>
            <div className="project-grid">
              {STUDIO_PROJECTS.map((project) => (
                <button
                  key={project.key}
                  className="project-card"
                  onClick={() => clickHandler(project.label)}
                >
                  <div className="card-chips">
                    {chips(project.math).map((c) => (
                      <span key={c} className="chip">
                        {c}
                      </span>
                    ))}
                  </div>
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-blurb">{project.blurb}</p>
                  <span className="card-open">Open demo →</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ─── Focused workspace ───────────────────────────────────────── */
        <div id="studio-workspace">
          <header id="ws-header">
            <button className="ws-back" onClick={() => navigate("/studio")}>
              ← All projects
            </button>
            <div className="ws-titleblock">
              <div className="ws-titlerow">
                <span className="ws-title">{current.title}</span>
                <span className="ws-chips">
                  {chips(current.math).map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </span>
              </div>
              <p className="ws-blurb">{current.blurb}</p>
            </div>
          </header>

          <div id="ws-tabs" role="tablist" aria-label="Studio project views">
            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === "demo"}
              className={workspaceTab === "demo" ? "active" : ""}
              onClick={() => setWorkspaceTab("demo")}
            >
              Product
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === "math"}
              className={workspaceTab === "math" ? "active" : ""}
              onClick={() => setWorkspaceTab("math")}
            >
              Math Used
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === "code"}
              className={workspaceTab === "code" ? "active" : ""}
              onClick={() => setWorkspaceTab("code")}
            >
              Code
            </button>
          </div>

          <div id="ws-tab-panels">
            <div
              id="ws-canvas-host"
              className={workspaceTab === "demo" ? "active" : ""}
              role="tabpanel"
              aria-hidden={workspaceTab !== "demo"}
            >
              {activeProject ? (
                <StudioCanvas activeProject={activeProject} />
              ) : (
                <div style={{ padding: "20px", color: "#a0a080" }}>
                  Loading…
                </div>
              )}
            </div>

            <div
              id="ws-math-panel"
              className={workspaceTab === "math" ? "active" : ""}
              role="tabpanel"
              aria-hidden={workspaceTab !== "math"}
            >
              <div className="math-panel-inner">
                <header className="math-panel-header">
                  <h2>Which functions are doing the work?</h2>
                  <p>
                    The product is the trick. These are the reusable math pieces
                    underneath it, in plain English.
                  </p>
                </header>

                <div className="math-function-list">
                  {current.functionsUsed.map((item: FunctionUse) => {
                    const refs = lineReferenceText(current.codePen, item);
                    return (
                      <article className="math-function-card" key={item.name}>
                        <h3>
                          {item.fn ? (
                            <Link to={docsHref(item.fn)}>{item.name}</Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        {refs && <p className="math-line-ref">{refs}</p>}
                        <p>{item.note}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside
              id="ws-source-panel"
              className={workspaceTab === "code" ? "active" : ""}
              role="tabpanel"
              aria-hidden={workspaceTab !== "code"}
              aria-label={`${current.title} source code`}
            >
              <div className="source-panel-header">
                <div>
                  <h2>Code</h2>
                  <p>
                    Organized, commented source for the same demo running here.
                  </p>
                </div>
                <form
                  action={CODEPEN_ENDPOINT}
                  method="POST"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-codepen-form"
                >
                  <input
                    type="hidden"
                    name="data"
                    value={JSON.stringify(current.codePen)}
                  />
                  <button type="submit">Tinker in CodePen ↗</button>
                </form>
              </div>

              <div className="source-tabs" role="tablist" aria-label="Source files">
                {sourceBlocks(current.codePen).map((block) => (
                  <button
                    key={block.label}
                    type="button"
                    role="tab"
                    aria-selected={sourceTab === block.label}
                    className={sourceTab === block.label ? "active" : ""}
                    onClick={() => setSourceTab(block.label as SourceTab)}
                  >
                    {block.label}
                  </button>
                ))}
              </div>

              <div className="source-code-pane" role="tabpanel">
                <pre>
                  <code>
                    {(currentSource?.code ?? "").split("\n").map((line, index) => (
                      <span className="code-line" key={`${sourceTab}-${index}`}>
                        <span className="line-number">{index + 1}</span>
                        <span className="line-text">{line || " "}</span>
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}

export default Studio;
