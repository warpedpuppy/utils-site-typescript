import { useEffect, createRef } from "react";
import "./PrimaryCanvas.scss";

type CanvasObject = {
  activeObject: IndividualObject;
};

type IndividualObject = {
  bf: Function;
  end: Function;
  t: string;
  l: string;
  f: Function;
};

function PrimaryCanvas(props: CanvasObject) {
  const activeObject: IndividualObject = props.activeObject;
  const canvasRef = createRef<HTMLCanvasElement>();
  useEffect(() => {
    activeObject.bf(canvasRef.current);
  }, [activeObject, canvasRef]);
  return <canvas ref={canvasRef}></canvas>;
}

export default PrimaryCanvas;
