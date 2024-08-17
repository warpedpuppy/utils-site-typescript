import { useEffect, useState } from "react";
import PrimaryCanvasHeader from "./PrimaryCanvasHeader";
import Modal from "../modal/Modal";
function CanvasContainer({ instance }: { instance: any }) {
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [instanceOfClass, setInstanceOfClass] = useState<any>();
  useEffect(() => {
    let i = instance?.initiate("primary-canvas--content--canvas-container");
    i?.init();
    setTitle(i?.title);
    setInstanceOfClass(i);
    return () => i?.stop();
  }, [instance, setTitle]);

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
      <div id="primary-canvas--content">
        <div id="primary-canvas--content--text"></div>
        <div id="primary-canvas--content--canvas-container"></div>
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

export default CanvasContainer;
