import { useEffect, useState } from "react";
import "./StudioCanvas.scss";

function StudioCanvas({ activeProject, siteData }: { activeProject: any; siteData: any }) {
  const [instanceOfClass, setInstanceOfClass] = useState<any>();

  useEffect(() => {
    if (!activeProject) {
      console.log("StudioCanvas: No active project");
      return;
    }

    try {
      console.log("StudioCanvas: Creating instance of", activeProject.Cls.name);

      const instance = new activeProject.Cls("studio-canvas-wrapper");

      console.log("StudioCanvas: Calling init()");
      instance.init();
      setInstanceOfClass(instance);

      return () => {
        console.log("StudioCanvas: Cleaning up");
        instance?.stop();
      };
    } catch (error) {
      console.error("StudioCanvas: Error during setup", error);
    }
  }, [activeProject]);

  return (
    <div id="studio-canvas-section">
      <div id="studio-canvas-wrapper"></div>
      <div id="studio-notes-panel">
        <div className="notes-header">
          <div>
            <h3>Design Decisions</h3>
            <p className="notes-subhead">Why is this built this way?</p>
          </div>
          <button
            className="close-notes"
            onClick={() => {
              const panel = document.getElementById('studio-notes-panel');
              if (panel) panel.classList.toggle('collapsed');
            }}
          >
            ×
          </button>
        </div>
        <div id="studio-text-content"></div>
      </div>
    </div>
  );
}

export default StudioCanvas;
