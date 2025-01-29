import "./createJSONTabs.scss";
import { useNavigate } from "react-router-dom";
function CreateJSONTabs({
  setTabBody,
  tabBody,
}: {
  setTabBody: Function;
  tabBody: number;
}) {
  let navigate = useNavigate();
  function onClickHandler(tabNumber: number) {
    navigate(`/create-json/${tabNumber}`);
    setTabBody(tabNumber);
  }
  return (
    <div id="create-json-tabs">
      <div
        className={tabBody === 0 ? "active-tab" : ""}
        onClick={() => onClickHandler(0)}
      >
        choose functions
      </div>
      <div
        className={tabBody === 1 ? "active-tab" : ""}
        onClick={() => onClickHandler(1)}
      >
        view/copy functions
      </div>
      <div
        className={tabBody === 2 ? "active-tab" : ""}
        onClick={() => onClickHandler(2)}
      >
        supporting interfaces
      </div>
    </div>
  );
}

export default CreateJSONTabs;
