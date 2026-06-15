import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import "./Studio.scss";
import StudioCanvas from "./StudioCanvas";
import AudioVisualizerWireframe from "../../siteData/studio/AudioVisualizerWireframe";

function Studio() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState<{ Cls: any } | null>(null);

  const projects = [
    {
      key: "AudioVisualizerWireframe",
      title: AudioVisualizerWireframe.t,
      label: AudioVisualizerWireframe.l,
      blurb: "A circular FFT display built from synthetic sine waves. Swap one line for a real microphone.",
      ProjectClass: AudioVisualizerWireframe,
    },
  ];

  // Handle redirect on initial load
  useEffect(() => {
    if (!projectName && projects.length > 0) {
      navigate(`/studio/${projects[0].label}`);
    }
  }, [projectName, navigate, projects]);

  // Load project when URL changes
  useEffect(() => {
    if (!projectName) return;

    const project = projects.find(p => p.label === projectName);
    if (project) {
      // Wrap in object — React calls bare functions as state updaters (no 'new'), crashing class constructors
      setActiveProject({ Cls: project.ProjectClass });
    } else {
      console.warn(`Project not found: ${projectName}`);
    }
  }, [projectName, projects]);

  function clickHandler(label: string) {
    navigate(`/studio/${label}`);
  }

  return (
    <section id="studio-page">
      <Helmet>
        <title>Build With It — Utilspalooza</title>
        <meta
          name="description"
          content="Practical micro-projects showing how to use canvas animations in real code."
        />
        <link rel="canonical" href="https://utilspalooza.com/studio" />
      </Helmet>

      <div id="studio-container">
        <aside id="studio-sidebar">
          <h2>Build With It</h2>
          <p className="sidebar-subtitle">From "how does it work?" to "how do I use it?"</p>

          <div className="studio-intro">
            <p>
              The <strong>Examples</strong> section explains the math. This section shows you
              how to wire that math into real code — each project is a small,
              complete thing a developer might actually ship.
            </p>
            <div className="studio-how-to-use">
              <div className="how-step"><span className="step-num">1</span><span>Watch the live demo on the canvas</span></div>
              <div className="how-step"><span className="step-num">2</span><span>Read the <em>Design Decisions</em> panel → to understand the <em>why</em> behind each choice</span></div>
              <div className="how-step"><span className="step-num">3</span><span>Hit <em>copy starter code</em> for a paste-ready starting point</span></div>
            </div>
          </div>

          <h3 className="projects-label">Projects</h3>
          <div className="projects-list">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.key}
                  className={`project-item ${
                    projectName === project.label ? "active" : ""
                  }`}
                  onClick={() => clickHandler(project.label)}
                >
                  <div className="project-title">{project.title}</div>
                </div>
              ))
            ) : (
              <p style={{ color: "#a0a080", fontSize: "12px" }}>No projects found</p>
            )}
          </div>
        </aside>

        <main id="studio-content">
          {(() => {
            const project = projects.find(p => p.label === projectName);
            return project ? (
              <div id="studio-project-header">
                <span id="studio-project-title">{project.title}</span>
                <span id="studio-project-blurb">{project.blurb}</span>
              </div>
            ) : null;
          })()}
          {activeProject ? (
            <StudioCanvas activeProject={activeProject} siteData={{}} />
          ) : (
            <div style={{ padding: "20px", color: "#a0a080" }}>Loading...</div>
          )}
        </main>
      </div>
    </section>
  );
}

export default Studio;
