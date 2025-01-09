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

  return (
    <div id="create-json">
      <div id="create-json-container">
        <div className="create-json-container--content">
          <div className="create-json--tab">see checklist</div>
          <div className="tab-content">{checklist}</div>
        </div>

        <div className="create-json-container--content">
          <div className="tab-content">
            <JSONContent />
          </div>
          <div className="create-json--tab">see json</div>
        </div>

        {/* <CreateJSONTabs setTabBody={setTabBody} tabBody={tabBody} /> */}
      </div>
    </div>
  );
}

export default CreateJSON;
