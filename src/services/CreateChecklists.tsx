import { ReactNode, useCallback } from "react";
import animationManifest from "../animationManifest";
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

      let loopingObj = { ...animationManifest };
      const isExampleChecklist = containerClass.includes("example");
      if (isExampleChecklist) {
        delete loopingObj["simple useful equations"];
      }
      Object.entries(loopingObj).forEach((innerArray, index) => {
        const firstEntry = Object.entries(innerArray[1]).find(
          ([, v]: any) => v.include !== false
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
          <CheckListDT
            innerText={innerArray[0]}
            count={tempArray.length}
            key={`createjson-dt-${innerArray[0]}`}
            open={open}
            index={index}
            test={(i: number) => {
              if (setOpen) setOpen(i);
              if (clickHandler && i !== 10 && firstEntry) {
                const [itemKey, itemVal] = firstEntry as [string, any];
                clickHandler(`/examples/${itemVal.l}`, innerArray[0], itemKey);
              }
            }}
          />
        );
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
