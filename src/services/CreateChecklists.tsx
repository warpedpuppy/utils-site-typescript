import { ReactNode, useCallback } from "react";
import animationManifest from "../animationManifest";
import { Nullable } from "../types/types";
import { Link, useLocation } from "react-router-dom";
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
          const { t, l, f } = innerInnerArray[1];
          const docsTarget = f.keyFunction?.name ?? "";
          const docsHref = docsTarget
            ? `/api?tab=documentation&fn=${encodeURIComponent(docsTarget)}`
            : "";

          if (innerInnerArray[1].include !== false)
            tempArray.push(
              <div
                key={`createjson-dd-${l}`}
                className="individual-checklist-item"
              >
                {clickHandler !== null ? (
                  <div
                    className={
                      location.pathname.includes(l)
                        ? "checklist-div active"
                        : "checklist-div"
                    }
                  >
                    <Link className="example-checklist-link" to={`/examples/${l}`}>
                      <div className="hover-anim"></div>
                      <div className="link-name">{t}</div>
                    </Link>
                    <div className="example-checklist-actions">
                      {docsHref && (
                        <Link className="checklist-mini-link" to={docsHref}>
                          docs
                        </Link>
                      )}
                      <Link
                        className="checklist-mini-link"
                        to={`/examples/${l}`}
                        state={{ openCode: true }}
                      >
                        full function
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <CheckListCheckbox
                      objectProperty={innerInnerArray[0]}
                      idAttribute={`${l}`}
                    />
                    <label htmlFor={`${l}`}>{t}</label>
                  </>
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
              const nextOpen = open === i ? -1 : i;
              if (setOpen) setOpen(nextOpen);
              if (clickHandler && nextOpen !== -1 && firstEntry) {
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
