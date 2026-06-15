import "./ModalTabs.scss";
function ModalTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: Function;
}) {
  let arr: string[] = [
    "active function",
    "dependent functions",
    "all interfaces",
  ];
  return (
    <div id="modal-tabs">
      {arr.map((item, i) => {
        return (
          <div
            key={`modal-tab-${i}`}
            className={i === activeTab ? "active-modal-tab" : ""}
            onClick={() => setActiveTab(i)}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

export default ModalTabs;
