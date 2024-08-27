import { useState } from "react";
import ModalTabs from "./ModalTabs";
import { ShapesString } from "../../types/shapes";
import "./Modal.scss";
import { CollisionDetectionObject } from "../../types/types";
function Modal({
  animationObject,
  closeModal,
}: {
  animationObject: CollisionDetectionObject;
  closeModal: Function;
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="modal-container">
      <div className="modal-inner">
        <div className="modal-inner-header">
          <span>active function, dependencies, and all interfaces: </span>
          <span className="close-modal" onClick={() => closeModal()}>
            x
          </span>
        </div>
        <div className="modal-inner-content">
          <ModalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 0 && <pre>{animationObject.functionString}</pre>}
          {activeTab === 1 && (
            <div>
              {animationObject.dependencies.map((item, i) => {
                return <pre key={`modal-dependencies-${i}`}>{item}</pre>;
              })}
            </div>
          )}
          {activeTab === 2 && <pre>{ShapesString}</pre>}
        </div>
      </div>
    </div>
  );
}

export default Modal;
