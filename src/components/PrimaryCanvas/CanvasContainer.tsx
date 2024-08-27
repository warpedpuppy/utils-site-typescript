import { useEffect, useState } from "react";
import PrimaryCanvasHeader from "./PrimaryCanvasHeader";
import Modal from "../modal/Modal";
function CanvasContainer({ instance }: { instance: any }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [animationObject, setAnimationObject] = useState({
    keyFunction: () => {},
    dependencies: [],
    functionString: "",
  });
  const [instanceOfClass, setInstanceOfClass] = useState<any>();
  useEffect(() => {
    let i = instance?.initiate("primary-canvas--content--canvas-container");
    i?.init();
    setInstanceOfClass(i);
    setAnimationObject(i?.animationObject);
    return () => i?.stop();
  }, [instance]);

  function showEquationHandler() {
    setShowModal(true);
  }

  return (
    <section id="primary-canvas">
      <PrimaryCanvasHeader
        instanceOfClass={instanceOfClass}
        showEquationHandler={showEquationHandler}
      />
      <div id="primary-canvas--content">
        <div id="primary-canvas--content--text"></div>
        <div id="primary-canvas--content--canvas-container"></div>
      </div>
      {showModal && (
        <Modal
          animationObject={animationObject}
          closeModal={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

export default CanvasContainer;
