import { useEffect, useState, createRef } from "react";
import {
  GenericObject,
  CanvasObject,
  AnimationObject,
} from "../../types/types";
import Modal from "../modal/Modal";
import "./PrimaryCanvas.scss";

function PrimaryCanvas(props: CanvasObject) {
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const activeObject: AnimationObject = props.activeObject;
  const canvasRef = createRef<HTMLDivElement>();

  useEffect(() => {
    let obj: GenericObject = activeObject.bf(canvasRef.current, activeObject.f);
    obj?.init();
    setTitle(activeObject.t);
    return () => obj?.stop();
  }, [activeObject, canvasRef]);

  function showEquationHandler() {
    setShowModal(true);
  }

  return (
    <section id="primary-canvas-section">
      <div id="primary-canvasHeader">
        <h3>{title}</h3>
        <button onClick={showEquationHandler}>see equation</button>
      </div>
      <div id="primary-canvas-cont" ref={canvasRef}></div>
      {showModal && (
        <Modal
          functionString={activeObject.f}
          closeModal={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

export default PrimaryCanvas;
