import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimationInstance } from "../../types/types";

function PrimaryCanvasHeader({
  instanceOfClass,
  showEquationHandler,
  motionPlaying,
  toggleMotionHandler,
}: {
  instanceOfClass: AnimationInstance | undefined;
  showEquationHandler: () => void;
  motionPlaying: boolean;
  toggleMotionHandler: () => void;
}) {
  const [html, setHTML] = useState<ReactNode>();
  const location = useLocation();
  const state = location.state as { fromApi?: boolean; fnName?: string } | null;
  const fromApi = state?.fromApi;
  const fnName = state?.fnName;

  useEffect(() => {
    setHTML("");
    if (instanceOfClass?.extraHTML) {
      setHTML(instanceOfClass?.extraHTML);
    }
  }, [instanceOfClass]);

  return (
    <div id="primary-canvas--header">
      <div className="primary-canvas-header-left">
        {fromApi && fnName && (
          <Link
            to={`/api?tab=documentation&fn=${fnName}`}
            className="primary-canvas-back-link"
          >
            ← {fnName} docs
          </Link>
        )}
        <button onClick={() => showEquationHandler()}>{"{ }"} view code</button>
        {instanceOfClass && (
          <button
            onClick={toggleMotionHandler}
            aria-label={motionPlaying ? "Pause the animation" : "Play the animation"}
          >
            {motionPlaying ? "❚❚ pause" : "▶ play"}
          </button>
        )}
      </div>
      <div id="primary-canvas--header_extra_html">{html}</div>
    </div>
  );
}

export default PrimaryCanvasHeader;
