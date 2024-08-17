import { useEffect, useState } from "react";

function PrimaryCanvasHeader({
  title,
  instanceOfClass,
  showEquationHandler,
}: {
  title: string;
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
      <h3>{title}</h3>
      {html}
      <button onClick={() => showEquationHandler()}>see equation</button>
    </div>
  );
}

export default PrimaryCanvasHeader;
