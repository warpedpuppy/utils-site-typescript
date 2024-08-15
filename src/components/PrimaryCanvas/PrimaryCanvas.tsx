import {
  useEffect,
  useState,
  createRef,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import {
  GenericObject,
  CanvasObject,
  AnimationObject,
  Nullable,
} from "../../types/types";
import Modal from "../modal/Modal";
import "./PrimaryCanvas.scss";

function PrimaryCanvas(props: CanvasObject) {
  const [title, setTitle] = useState<string>("");
  const [extraHTML, setExtraHTML] = useState<ReactNode>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const activeObject: any = props.activeObject;
  const canvasRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setExtraHTML("");
    setTitle(activeObject?.title);
    if (activeObject?.extraHTML) {
      setExtraHTML(activeObject.extraHTML);
    }
    return () => activeObject?.stop();
  }, [activeObject]);

  useEffect(() => {
    activeObject?.init(canvasRef.current);
  }, [activeObject, canvasRef]);

  function showEquationHandler() {
    setShowModal(true);
  }

  return (
    <section id="primary-canvas">
      <div id="primary-canvas--header">
        <h3>{title}</h3>
        {extraHTML}
        <button onClick={showEquationHandler}>see equation</button>
      </div>
      <div id="primary-canvas--content">
        <div id="primary-canvas--content--text"></div>
        <div
          id="primary-canvas--content--canvas-container"
          ref={canvasRef}
        ></div>
      </div>
      {showModal && (
        <Modal
          functionString={activeObject.keyFunction}
          closeModal={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

export default PrimaryCanvas;
