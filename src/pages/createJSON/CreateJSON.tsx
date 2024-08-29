import { ReactNode, useEffect, useState } from "react";
import "./CreateJSON.scss";
import SiteData from "../../siteData/SiteData";
import { CollisionDetectionObject, GenericObject } from "../../types/types";
import CreateJSONTabs from "./createJSONComponents/createJSONTabs";
import JSONContent from "./createJSONComponents/JSONContent";
import JSONCheckbox from "./createJSONComponents/JSONCheckbox";
import LocalStorageManager from "../../services/LocalStorageManager";
function CreateJSON() {
  const [checklist, setChecklist] = useState<ReactNode[]>([
    <dt key={`holder`}></dt>,
  ]);
  const [tabBody, setTabBody] = useState<number>(0);
  const [json, setJSON] = useState<GenericObject>({});
  const { addToLocaStorage, deleteFromLocaStorage } = LocalStorageManager();

  useEffect(() => {
    let arr = [];
    let key: keyof typeof SiteData;
    for (key in SiteData) {
      arr.push(<dt key={`createjson-dt-${key}`}>{key}</dt>);
      const subObject: GenericObject = SiteData[key];

      let innerKey: keyof typeof subObject;
      for (innerKey in subObject) {
        let { t, include } = subObject[innerKey];

        let x = new subObject[innerKey]();
        let animationObject = x.animationObject;
        let className = x.constructor.name;
        let { keyFunction } = x;
        if (include === false) {
          continue;
        }
        arr.push(
          <JSONCheckbox
            key={`createjson-dd-${innerKey}`}
            t={t}
            animationObject={animationObject}
            clickHandler={clickHandler}
            bool={json.hasOwnProperty(t)}
            keyFunction={keyFunction}
            className={className}
          />
        );
      }
    }
    setChecklist(arr);
    function clickHandler(
      str: string,
      keyFunction: Function,
      className: string,
      animationObject: CollisionDetectionObject
    ) {
      if (json.hasOwnProperty(str)) {
        let temp: GenericObject = { ...json };
        delete temp[str];
        deleteFromLocaStorage(className);
        setJSON(temp);
      } else {
        let temp: GenericObject = { ...json };
        temp[str] = { className, keyFunction, animationObject };
        addToLocaStorage(className);
        setJSON(temp);
      }
    }
  }, [json]);

  return (
    <div id="create-json">
      <CreateJSONTabs setTabBody={setTabBody} tabBody={tabBody} />
      {tabBody === 0 && (
        <div className="tab-content">
          <dl>{checklist}</dl>
        </div>
      )}
      {tabBody === 1 && (
        <div className="tab-content">
          <JSONContent json={json} />{" "}
        </div>
      )}
    </div>
  );
}

export default CreateJSON;
