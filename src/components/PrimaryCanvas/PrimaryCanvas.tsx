import { useEffect, createRef } from "react";
import {
  GenericObject,
  CanvasObject,
  AnimationObject,
} from "../../types/types";
import "./PrimaryCanvas.scss";

function PrimaryCanvas(props: CanvasObject) {
  const activeObject: AnimationObject = props.activeObject;
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.height = canvasRef.current?.clientHeight;
      canvasRef.current.width = canvasRef.current?.clientWidth;
    }
    let obj: GenericObject = activeObject.bf(canvasRef.current);
    obj?.init();

    return () => obj?.stop();
  }, [activeObject, canvasRef]);

  return <canvas id="primary-canvas" ref={canvasRef}></canvas>;
}

export default PrimaryCanvas;
