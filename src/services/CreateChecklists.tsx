import { ReactNode, useCallback } from "react";
import SiteData from "../siteData/SiteData";
import { Nullable } from "../types/types";
import { useLocation } from "react-router-dom";
import CheckListCheckbox from "./CheckListCheckbox";
import CheckListDT from "./CheckListDT";
import "./CreateChecklists.scss";

function CreateChecklists() {
  const location = useLocation();

  let createChecklist = useCallback(
    (containerClass: string, clickHandler: Nullable<Function> = null) => {
      let returnArray: ReactNode[] = [];

      let loopingObj = { ...SiteData };
      if (containerClass.includes("example")) {
        delete loopingObj["simple useful equations"];
      }

      Object.entries(loopingObj).forEach((innerArray) => {
        returnArray.push(
          <CheckListDT
            innerText={innerArray[0]}
            key={`createjson-dt-${innerArray[0]}`}
          />
        );
        let tempArray: ReactNode[] = [];
        Object.entries(innerArray[1]).forEach((innerInnerArray) => {
          const { t, l } = innerInnerArray[1];

          if (innerInnerArray[1].include !== false)
            tempArray.push(
              <div
                key={`createjson-dd-${l}`}
                className="individual-checklist-item"
              >
                <CheckListCheckbox
                  objectProperty={innerInnerArray[0]}
                  idAttribute={`${l}`}
                />

                {clickHandler !== null ? (
                  <div
                    className={
                      location.pathname.includes(l)
                        ? "checklist-div active"
                        : "checklist-div"
                    }
                    onClick={() =>
                      clickHandler(
                        `/examples/${l}`,
                        innerArray[0],
                        innerInnerArray[0]
                      )
                    }
                  >
                    <div className="hover-anim"></div>
                    <div className="link-name">{t}</div>
                  </div>
                ) : (
                  <label htmlFor={`${l}`}>{t}</label>
                )}
              </div>
            );
        });
        returnArray.push(
          <div className="inner-checklist" key="inner-checklist">
            {tempArray}
          </div>
        );
      });

      return (
        <div className={`dl-masterclass checklist ${containerClass}`}>
          {returnArray}
        </div>
      );
    },
    [location]
  );

  return { createChecklist };
}

export default CreateChecklists;
