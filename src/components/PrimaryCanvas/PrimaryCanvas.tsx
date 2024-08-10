import { useEffect, createRef } from "react";
import "./PrimaryCanvas.scss";

type CanvasObject = {
  activeObject: IndividualObject;
};

type IndividualObject = {
  bf: Function;
  t: string;
  l: string;
  f: Function;
};

type AnimationObject = {
  [index: string]: any;
};

function PrimaryCanvas(props: CanvasObject) {
  const activeObject: IndividualObject = props.activeObject;
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.height = canvasRef.current?.clientHeight;
      canvasRef.current.width = canvasRef.current?.clientWidth;
    }
    let obj: AnimationObject = activeObject.bf(canvasRef.current);
    obj?.init();

    return () => obj?.stop();
  }, [activeObject, canvasRef]);

  return <canvas id="primary-canvas" ref={canvasRef}></canvas>;
}

export default PrimaryCanvas;
