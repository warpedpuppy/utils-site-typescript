import { useEffect } from "react";
import "./PrimaryCanvas.scss";

type CanvasObject = {
  activeObject: object;
};

function PrimaryCanvas(props: CanvasObject) {
  const activeObject: object = props.activeObject;
  useEffect(() => {
    console.log(activeObject);
  }, [activeObject]);
  return <canvas id="primary-canvas"></canvas>;
}

export default PrimaryCanvas;
