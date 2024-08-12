import "./Modal.scss";
function Modal({
  functionString,
  closeModal,
}: {
  functionString: Function;
  closeModal: Function;
}) {
  return (
    <div className="modal-container" onClick={() => closeModal()}>
      <div className="modal-inner">
        <div className="modal-inner-header">active function: </div>
        <div className="modal-inner-content">
          <pre>{functionString.toString()}</pre>
        </div>
      </div>
    </div>
  );
}

export default Modal;
