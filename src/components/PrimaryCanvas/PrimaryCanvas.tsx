import { useEffect } from "react";
import "./PrimaryCanvas.scss";

type CanvasObject = {
  activeFunction: string;
};

function PrimaryCanvas(props: CanvasObject) {
  const activeFunction: string = props.activeFunction;
  useEffect(() => {
    console.log(activeFunction);
  }, [activeFunction]);
  return <canvas id="primary-canvas"></canvas>;
}

export default PrimaryCanvas;
