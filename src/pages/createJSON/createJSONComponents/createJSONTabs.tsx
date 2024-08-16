import "./createJSONTabs.scss";
function CreateJSONTabs({
  setTabBody,
  tabBody,
}: {
  setTabBody: Function;
  tabBody: number;
}) {
  return (
    <div id="create-json-tabs">
      <div
        className={tabBody === 0 ? "active-tab" : ""}
        onClick={() => setTabBody(0)}
      >
        choose functions
      </div>
      <div
        className={tabBody === 1 ? "active-tab" : ""}
        onClick={() => setTabBody(1)}
      >
        view/copy json
      </div>
    </div>
  );
}

export default CreateJSONTabs;
