import { ReactNode, useCallback, useState, useEffect } from "react";
import "./CreateChecklists.scss";
import SiteData from "../siteData/SiteData";
import { CollisionDetectionObject, GenericObject } from "../types/types";
import { Nullable } from "../types/types";
import LocalStorageManager from "./LocalStorageManager";
import { useLocation } from "react-router-dom";

function CreateChecklists() {
  const {
    addToLocaStorage,
    deleteFromLocaStorage,
    isInLocalStorage,
    getLocalStorageAsArray,
  } = LocalStorageManager();
  const [list, setList] = useState<string[]>([]);
  const location = useLocation();

  let getFunctionName = (functionString: string) => {
    return functionString
      .substring(
        functionString.indexOf("function") + 8,
        functionString.indexOf("(")
      )
      .trim();
  };
  useEffect(() => {
    // set it upon page load
    let tempArray: any = getLocalStorageAsArray();
    setList(tempArray);
  }, [getLocalStorageAsArray]);

  let createChecklist = useCallback(
    (
      containerClass: string,
      json: any,
      clickHandler: Nullable<Function> = null
    ) => {
      function changeHandler(f: CollisionDetectionObject) {
        const { functionString } = f;
        let label = getFunctionName(functionString);
        let tempArray: any = getLocalStorageAsArray();

        if (isInLocalStorage(label)) {
          deleteFromLocaStorage(label);
          setList(tempArray.filter((item: string) => item !== label));
        } else {
          addToLocaStorage(label);
          setList([...tempArray, getFunctionName(functionString)]);
        }
      }

      let returnArray: ReactNode[] = [];

      Object.entries(SiteData).forEach((innerArray) => {
        returnArray.push(
          <dt key={`createjson-dt-${innerArray[0]}`}>{innerArray[0]}</dt>
        );
        Object.entries(innerArray[1]).forEach((innerInnerArray) => {
          const { t, f, l } = innerInnerArray[1];

          if (innerInnerArray[1].include !== false)
            returnArray.push(
              <dd key={`createjson-dd-${t}`}>
                <input
                  type="checkbox"
                  onChange={() => changeHandler(f)}
                  checked={list.includes(getFunctionName(f.functionString))}
                />
                {clickHandler !== null ? (
                  <div
                    className={location.pathname.includes(l) ? "active" : ""}
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
    [
      addToLocaStorage,
      deleteFromLocaStorage,
      isInLocalStorage,
      getLocalStorageAsArray,
      location,
      list,
    ]
  );

  return { createChecklist };
}

export default CreateChecklists;
