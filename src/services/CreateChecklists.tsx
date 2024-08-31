import { ReactNode, useCallback } from "react";
import SiteData from "../siteData/SiteData";
import { Nullable } from "../types/types";
import { useLocation } from "react-router-dom";
import CheckListCheckbox from "./CheckListCheckbox";
import "./CreateChecklists.scss";

function CreateChecklists() {
  const location = useLocation();

  let createChecklist = useCallback(
    (containerClass: string, clickHandler: Nullable<Function> = null) => {
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
                <CheckListCheckbox
                  objectProperty={innerInnerArray[0]}
                  idAttribute={`${l}`}
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
                  <label htmlFor={`${l}`}>{t}</label>
                )}
              </dd>
            );
        });
      });

      return (
        <dl className={`dl-masterclass ${containerClass}`}>{returnArray}</dl>
      );
    },
    [location]
  );

  return { createChecklist };
}

export default CreateChecklists;
