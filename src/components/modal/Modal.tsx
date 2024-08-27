import { useEffect, useState } from "react";
import ModalTabs from "./ModalTabs";
import { ShapesString } from "../../types/shapes";
import "./Modal.scss";
function Modal({
  functionParam,
  closeModal,
  dependenciesParam,
}: {
  functionParam: Function;
  closeModal: Function;
  dependenciesParam: string[];
}) {
  const [functionString, setFunctionString] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    let tempString = functionParam.toString();

    setFunctionString(tempString);
  }, [functionParam]);
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
          {activeTab === 0 && <pre>{functionString}</pre>}
          {activeTab === 1 && (
            <div>
              {dependenciesParam.map((item, i) => {
                return <div key={`modal-dependencies-${i}`}>{item}</div>;
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
