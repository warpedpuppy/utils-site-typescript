import { ReactNode, useEffect, useState } from "react";
import "./CreateJSON.scss";
import SiteData from "../siteData/SiteData";
import { GenericObject } from "../types/types";
function CreateJSON() {
  const [checklist, setChecklist] = useState<ReactNode[]>([<dt></dt>]);
  useEffect(() => {
    let arr = [];
    let key: keyof typeof SiteData;
    function clickHandler(str: string, key: string, innerKey: string) {}
    for (key in SiteData) {
      arr.push(<dt key={`createjson-dt-${key}`}>{key}</dt>);
      let BigCat: string = key.toString();
      const subObject: GenericObject = SiteData[key];
      let innerKey: keyof typeof subObject;

      for (innerKey in subObject) {
        let { t, l, include } = subObject[innerKey];
        let LittleCat: string = innerKey.toString();

        if (include === false) {
          continue;
        }
        arr.push(
          <dd
            className="json-dd"
            key={`createjson-dd-${innerKey}`}
            onClick={() => clickHandler(`/examples/${l}`, BigCat, LittleCat)}
          >
            <input type="checkbox" />
            <div>{t}</div>
          </dd>
        );
      }
    }
    setChecklist(arr);
  }, []);

  return <dl>{checklist}</dl>;
}

export default CreateJSON;
