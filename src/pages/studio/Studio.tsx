import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import "./Studio.scss";
import StudioCanvas from "./StudioCanvas";
import AudioVisualizerWireframe, {
  AUDIO_VISUALIZER_PEN,
} from "./AudioVisualizerWireframe";
import GenerativeLogoTracer, {
  GENERATIVE_LOGO_TRACER_PEN,
} from "./GenerativeLogoTracer";
import OrganicTerrainMap, {
  ORGANIC_TERRAIN_MAP_PEN,
} from "./OrganicTerrainMap";
import ParticleConstellation, {
  PARTICLE_CONSTELLATION_PEN,
} from "./ParticleConstellation";
import PhysicsToy, { PHYSICS_TOY_PEN } from "./PhysicsToy";
import GenerativeWallpaper, {
  GENERATIVE_WALLPAPER_PEN,
} from "./GenerativeWallpaper";
import { CODEPEN_GALLERY } from "./pens";
import { CodePenPayload, CODEPEN_ENDPOINT } from "./codepen";

const projects = [
  {
    key: "AudioVisualizerWireframe",
    title: AudioVisualizerWireframe.t,
    label: AudioVisualizerWireframe.l,
    math: "Fourier DFT",
    blurb:
      "A circular FFT display built from synthetic sine waves. Swap one line for a real microphone.",
    ProjectClass: AudioVisualizerWireframe,
    codePen: AUDIO_VISUALIZER_PEN,
  },
  {
    key: "GenerativeLogoTracer",
    title: GenerativeLogoTracer.t,
    label: GenerativeLogoTracer.l,
    math: "Fourier DFT + Bézier",
    blurb:
      "Author a shape as Bézier curves, then watch a chain of rotating circles redraw it. The 'circles' slider is Fourier compression you can see.",
    ProjectClass: GenerativeLogoTracer,
    codePen: GENERATIVE_LOGO_TRACER_PEN,
  },
  {
    key: "OrganicTerrainMap",
    title: OrganicTerrainMap.t,
    label: OrganicTerrainMap.l,
    math: "Perlin + marching squares",
    blurb:
      "Fractal noise becomes a tinted heightmap; marching squares traces clean contour lines you can export as SVG.",
    ProjectClass: OrganicTerrainMap,
    codePen: ORGANIC_TERRAIN_MAP_PEN,
  },
  {
    key: "ParticleConstellation",
    title: ParticleConstellation.t,
    label: ParticleConstellation.l,
    math: "Phyllotaxis + lerp + Perlin",
    blurb:
      "Particles glide from chaos into a golden-angle lattice via eased lerp, then breathe through a Perlin drift field.",
    ProjectClass: ParticleConstellation,
    codePen: PARTICLE_CONSTELLATION_PEN,
  },
  {
    key: "PhysicsToy",
    title: PhysicsToy.t,
    label: PhysicsToy.l,
    math: "Orbital + Bounce + Collision",
    blurb:
      "Gravity, wall bounce, and elastic collision sharing one loop. Zero gravity is billiards; crank it up for a solar system.",
    ProjectClass: PhysicsToy,
    codePen: PHYSICS_TOY_PEN,
  },
  {
    key: "GenerativeWallpaper",
    title: GenerativeWallpaper.t,
    label: GenerativeWallpaper.l,
    math: "Bézier + Perlin + color",
    blurb:
      "Bézier petals varied by a Perlin field, clipped per cell so the pattern tiles seamlessly. Download a PNG for any CSS background.",
    ProjectClass: GenerativeWallpaper,
    codePen: GENERATIVE_WALLPAPER_PEN,
  },
];

function sourceBlocks(payload: CodePenPayload) {
  return [
    { label: "HTML", code: payload.html },
    { label: "CSS", code: payload.css },
    { label: "JS", code: payload.js },
  ];
}

function Studio() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState<{ Cls: any } | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<"demo" | "code">("demo");
  const [sourceTab, setSourceTab] = useState<"HTML" | "CSS" | "JS">("JS");
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

    const project = projects.find((p) => p.label === projectName);
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

  const current = projects.find((p) => p.label === projectName) || null;
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
              {projects.map((project) => (
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
                <StudioCanvas activeProject={activeProject} siteData={{}} />
              ) : (
                <div style={{ padding: "20px", color: "#a0a080" }}>
                  Loading…
                </div>
              )}
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
                    onClick={() => setSourceTab(block.label as "HTML" | "CSS" | "JS")}
                  >
                    {block.label}
                  </button>
                ))}
              </div>

              <div className="source-code-pane" role="tabpanel">
                <pre>
                  <code>{currentSource?.code ?? ""}</code>
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
