import { ReactNode, useCallback } from "react";
import "./CreateChecklists.scss";
import SiteData from "../siteData/SiteData";
import { CollisionDetectionObject, GenericObject } from "../types/types";
import { Nullable } from "../types/types";
import LocalStorageManager from "./LocalStorageManager";

function CreateChecklists() {
  const { addToLocaStorage, deleteFromLocaStorage } = LocalStorageManager();

  let createChecklist = useCallback(
    (
      containerClass: string,
      json: any,
      clickHandler: Nullable<Function> = null
    ) => {
      function changeHandler(f: CollisionDetectionObject) {
        const { functionString } = f;
        let label = functionString
          .substring(
            functionString.indexOf("function") + 8,
            functionString.indexOf("(")
          )
          .trim();
        if (json.hasOwnProperty(label)) {
          let temp: GenericObject = { ...json };
          delete temp[label];
          deleteFromLocaStorage(label);
          // setJSON(temp);
        } else {
          let temp: GenericObject = { ...json };
          temp[label] = f.functionString;
          addToLocaStorage(label);
          // setJSON(temp);
        }
      }

      let returnArray: ReactNode[] = [];

      Object.entries(SiteData).forEach((innerArray) => {
        returnArray.push(
          <dt key={`createjson-dt-${innerArray[0]}`}>{innerArray[0]}</dt>
        );
        Object.entries(innerArray[1]).forEach((innerInnerArray) => {
          const { t, f, l } = innerInnerArray[1];
          returnArray.push(
            <dd key={`createjson-dd-${t}`}>
              <input type="checkbox" onChange={() => changeHandler(f)} />
              {clickHandler !== null ? (
                <div
                  onClick={() =>
                    clickHandler(
                      `/examples/${l}`,
                      innerArray[0],
                      innerInnerArray[0]
                    )
                  }
                >
                  {t}
                </div>
              ) : (
                <div>{t}</div>
              )}
            </dd>
          );
        });
      });

      return (
        <dl className={`dl-masterclass ${containerClass}`}>{returnArray}</dl>
      );
    },
    [addToLocaStorage, deleteFromLocaStorage]
  );

  return { createChecklist };
}

export default CreateChecklists;
