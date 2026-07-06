import { useEffect, useState } from "react";
import { AnimationInstance } from "../../types/types";
import "./StudioCanvas.scss";

function StudioCanvas({
  activeProject,
}: {
  activeProject: { Cls: new (containerId: string) => AnimationInstance } | null;
}) {
  const [instanceOfClass, setInstanceOfClass] = useState<AnimationInstance>();
  const [notesOpen, setNotesOpen] = useState(false);
  // Mirrors the instance's motion gate so the pause/play button re-renders.
  const [motionPlaying, setMotionPlaying] = useState(true);

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
      setMotionPlaying(!instance.motionPaused);

      return () => {
        console.log("StudioCanvas: Cleaning up");
        instance?.stop();
      };
    } catch (error) {
      console.error("StudioCanvas: Error during setup", error);
    }
  }, [activeProject]);

  function toggleMotionHandler() {
    if (!instanceOfClass) return;
    if (instanceOfClass.motionPaused) {
      instanceOfClass.resumeMotion();
      setMotionPlaying(true);
    } else {
      instanceOfClass.pauseMotion();
      setMotionPlaying(false);
    }
  }

  return (
    <div id="studio-canvas-section">
      <div id="studio-canvas-wrapper"></div>
      {instanceOfClass && (
        <button
          type="button"
          className="studio-motion-toggle"
          onClick={toggleMotionHandler}
          aria-label={motionPlaying ? "Pause the animation" : "Play the animation"}
        >
          {motionPlaying ? "❚❚ pause" : "▶ play"}
        </button>
      )}
      <button
        type="button"
        className={`open-notes ${notesOpen ? "" : "visible"}`}
        onClick={() => setNotesOpen(true)}
      >
        Design decisions
      </button>
      <div id="studio-notes-panel" className={notesOpen ? "" : "collapsed"}>
        <div className="notes-header">
          <div>
            <h3>Design Decisions</h3>
            <p className="notes-subhead">Why is this built this way?</p>
          </div>
          <button
            className="close-notes"
            onClick={() => setNotesOpen(false)}
          >
            Hide
          </button>
        </div>
        <div id="studio-text-content"></div>
      </div>
    </div>
  );
}

export default StudioCanvas;
