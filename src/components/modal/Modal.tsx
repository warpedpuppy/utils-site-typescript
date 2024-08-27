import { useEffect, useState } from "react";
import ModalTabs from "./ModalTabs";
import "./Modal.scss";
function Modal({
  functionParam,
  closeModal,
}: {
  functionParam: Function;
  closeModal: Function;
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
        </div>
      </div>
    </div>
  );
}

export default Modal;
