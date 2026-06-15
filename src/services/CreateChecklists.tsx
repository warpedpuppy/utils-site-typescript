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
    (
      containerClass: string,
      clickHandler: Nullable<Function> = null,
      open: Nullable<number> = null,
      setOpen: Nullable<Function> = null
    ) => {
      let returnArray: ReactNode[] = [];

      let loopingObj = { ...SiteData };
      const isExampleChecklist = containerClass.includes("example");
      if (isExampleChecklist) {
        delete loopingObj["simple useful equations"];
      }
      const aiMadeStart = isExampleChecklist ? 3 : -1;
      Object.entries(loopingObj).forEach((innerArray, index) => {
        if (isExampleChecklist && index === 0) {
          returnArray.push(
            <div key="section-human" className="checklist-section-header">Human Made</div>
          );
        }
        if (isExampleChecklist && index === aiMadeStart) {
          returnArray.push(
            <div key="section-ai" className="checklist-section-header ai-made">AI Made</div>
          );
        }
        returnArray.push(
          <CheckListDT
            innerText={innerArray[0]}
            key={`createjson-dt-${innerArray[0]}`}
            open={open}
            index={index}
            test={(i: number) => {
              if (setOpen) setOpen(i);
            }}
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
          <div
            className="inner-checklist"
            key={`inner-checklist-${innerArray[0]}`}
          >
            {/* <div>header</div> */}
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
