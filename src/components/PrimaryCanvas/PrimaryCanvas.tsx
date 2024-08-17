import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  createRef,
  ReactNode,
} from "react";
import { CanvasObject } from "../../types/types";
import Modal from "../modal/Modal";
import ExamplesUtils from "../../pages/examples/ExamplesUtils";
import "./PrimaryCanvas.scss";
import PrimaryCanvasHeader from "./PrimaryCanvasHeader";

function PrimaryCanvas(props: any) {
  const { siteData }: { siteData: object } = props;
  const [title, setTitle] = useState<string>("");
  // const [instance, setInstance] = useState<any>(null);
  // const [extraHTML, setExtraHTML] = useState<ReactNode>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const activeObject: string[] = props.activeObject;

  // const canvasRef = createRef<HTMLDivElement>();
  const { createClassReference } = ExamplesUtils();

  const instanceOfClass = useMemo(() => {
    if (!activeObject || !activeObject[0]) return;
    let str1 = activeObject[0] as keyof object;
    let str2 = activeObject[1] as keyof object;
    let classRef = createClassReference(siteData[str1][str2]);
    let instance = classRef.initiate(
      "primary-canvas--content--canvas-container"
    );
    return instance;
  }, [activeObject, createClassReference, siteData]);

  useEffect(() => {
    instanceOfClass?.init();
    setTitle(instanceOfClass?.title);
    return () => instanceOfClass?.stop();
  }, [instanceOfClass]);

  function showEquationHandler() {
    setShowModal(true);
  }

  return (
    <section id="primary-canvas">
      <PrimaryCanvasHeader
        title={title}
        instanceOfClass={instanceOfClass}
        showEquationHandler={showEquationHandler}
      />
      {/* <canvas width="1000" height="1000" ref={canvasRef}></canvas> */}
      <div id="primary-canvas--content">
        <div id="primary-canvas--content--text"></div>
        <div id="primary-canvas--content--canvas-container2"></div>
      </div>
      {showModal && (
        <Modal
          functionString={instanceOfClass.keyFunction}
          closeModal={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

export default PrimaryCanvas;
