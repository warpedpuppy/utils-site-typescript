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
      {html}
      <button onClick={() => showEquationHandler()}>see equation</button>
    </div>
  );
}

export default PrimaryCanvasHeader;
