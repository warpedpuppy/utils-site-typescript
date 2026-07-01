import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function PrimaryCanvasHeader({
  instanceOfClass,
  showEquationHandler,
}: {
  instanceOfClass: any;
  showEquationHandler: Function;
}) {
  const [html, setHTML] = useState<any>();
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
      </div>
      <div id="primary-canvas--header_extra_html">{html}</div>
    </div>
  );
}

export default PrimaryCanvasHeader;
