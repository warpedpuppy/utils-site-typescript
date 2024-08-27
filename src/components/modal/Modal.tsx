import { useEffect, useState } from "react";
import "./Modal.scss";
function Modal({
  functionParam,
  closeModal,
}: {
  functionParam: Function;
  closeModal: Function;
}) {
  const [functionString, setFunctionString] = useState("");
  useEffect(() => {
    let tempString = functionParam.toString();

    setFunctionString(tempString);
  }, [functionParam]);
  return (
    <div className="modal-container" onClick={() => closeModal()}>
      <div className="modal-inner">
        <div className="modal-inner-header">
          active function, types, and dependencies:{" "}
        </div>
        <div className="modal-inner-content">
          <pre>{functionString}</pre>
        </div>
      </div>
    </div>
  );
}

export default Modal;
