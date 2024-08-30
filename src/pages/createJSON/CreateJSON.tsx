import { useState } from "react";
import "./CreateJSON.scss";
import { GenericObject } from "../../types/types";
import CreateJSONTabs from "./createJSONComponents/createJSONTabs";
import JSONContent from "./createJSONComponents/JSONContent";

import CreateChecklists from "../../services/CreateChecklists";

function CreateJSON() {
  const [tabBody, setTabBody] = useState<number>(0);
  const [json, setJSON] = useState<GenericObject>({});
  const { createChecklist } = CreateChecklists();

  let checklist = createChecklist("create-json-page-checklist", json);

  return (
    <div id="create-json">
      <CreateJSONTabs setTabBody={setTabBody} tabBody={tabBody} />
      {tabBody === 0 && <div className="tab-content">{checklist}</div>}
      {tabBody === 1 && (
        <div className="tab-content">
          <JSONContent json={json} />
        </div>
      )}
    </div>
  );
}

export default CreateJSON;
