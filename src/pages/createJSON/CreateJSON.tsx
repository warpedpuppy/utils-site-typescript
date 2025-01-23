import { useState, useEffect } from "react";
import "./CreateJSON.scss";
import { useParams } from "react-router-dom";
import CreateJSONTabs from "./createJSONComponents/createJSONTabs";
import JSONContent from "./createJSONComponents/JSONContent";

import CreateChecklists from "../../services/CreateChecklists";

function CreateJSON() {
  const [tabBody, setTabBody] = useState<number>(0);
  const { createChecklist } = CreateChecklists();
  const { tab } = useParams<string>();

  useEffect(() => {
    if (tab) setTabBody(+tab);
  }, [tab]);

  let checklist = createChecklist("create-json-page-checklist");

  function copyToClipboard() {
    let json = document.querySelector("pre code");
    if (json) {
      navigator.clipboard.writeText(json.textContent || "");
    }
  }

  return (
    <div id="create-json">
      <div id="create-json-container">
        <CreateJSONTabs setTabBody={setTabBody} tabBody={tabBody} />
        <div className={`tab-content ${tabBody === 0 ? "active" : ""}`}>
          {checklist}
        </div>
        <div className={`tab-content ${tabBody === 1 ? "active" : ""}`}>
          <button className="btn btn-primary" onClick={copyToClipboard}>
            copy to clipboard
          </button>
          <JSONContent />
        </div>
      </div>
    </div>
  );
}

export default CreateJSON;
