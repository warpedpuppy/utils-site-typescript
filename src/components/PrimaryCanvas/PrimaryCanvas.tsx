import { useEffect, createRef } from "react";
import {
  GenericObject,
  CanvasObject,
  AnimationObject,
} from "../../types/types";
import "./PrimaryCanvas.scss";

function PrimaryCanvas(props: CanvasObject) {
  const activeObject: AnimationObject = props.activeObject;
  const canvasRef = createRef<HTMLDivElement>();

  useEffect(() => {
    let obj: GenericObject = activeObject.bf(canvasRef.current, activeObject.f);
    console.log(obj);
    obj?.init();

    return () => obj?.stop();
  }, [activeObject, canvasRef]);

  return <div id="primary-canvas-cont" ref={canvasRef}></div>;
}

export default PrimaryCanvas;
