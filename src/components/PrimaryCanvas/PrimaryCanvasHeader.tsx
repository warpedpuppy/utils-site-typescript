import { useEffect, useState } from "react";

function PrimaryCanvasHeader({
  instanceOfClass,
  showEquationHandler,
}: {
  instanceOfClass: any;
  showEquationHandler: Function;
}) {
  const [html, setHTML] = useState<any>();
  useEffect(() => {
    setHTML("");
    if (instanceOfClass?.extraHTML) {
      setHTML(instanceOfClass?.extraHTML);
    }
  }, [instanceOfClass]);
  return (
    <div id="primary-canvas--header">
      <button onClick={() => showEquationHandler()}>see equation</button>
      <button onClick={() => showEquationHandler()}>see explanation</button>
      <button onClick={() => showEquationHandler()}>
        see step-by-step how animation was written
      </button>
      <div id="primary-canvas--header_extra_html">{html}</div>
    </div>
  );
}

export default PrimaryCanvasHeader;
