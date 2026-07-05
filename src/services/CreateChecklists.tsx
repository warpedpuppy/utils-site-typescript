import { ReactNode, useCallback } from "react";
import animationManifest from "../animationManifest";
import { Nullable } from "../types/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckListCheckbox from "./CheckListCheckbox";
import CheckListDT from "./CheckListDT";
import "./CreateChecklists.scss";

export interface ChecklistFilter {
  query: string;
  setQuery: (query: string) => void;
}

function CreateChecklists() {
  const location = useLocation();
  const navigate = useNavigate();

  let createChecklist = useCallback(
    (
      containerClass: string,
      clickHandler: Nullable<Function> = null,
      open: Nullable<number> = null,
      setOpen: Nullable<Function> = null,
      filter: Nullable<ChecklistFilter> = null
    ) => {
      let returnArray: ReactNode[] = [];
      const query = filter?.query.trim().toLowerCase() ?? "";

      let loopingObj = { ...animationManifest };
      Object.entries(loopingObj).forEach((innerArray, index) => {
        // A query hit on the category name keeps the whole category visible.
        const categoryMatches =
          query !== "" && innerArray[0].toLowerCase().includes(query);
        const visibleEntries = Object.entries(innerArray[1]).filter(
          ([, v]: any) => {
            if (v.include === false) return false;
            if (query === "" || categoryMatches) return true;
            return (
              v.title.toLowerCase().includes(query) ||
              v.slug.toLowerCase().includes(query)
            );
          }
        );
        if (query !== "" && visibleEntries.length === 0) return;
        const firstEntry = visibleEntries[0];
        let tempArray: ReactNode[] = [];
        visibleEntries.forEach((innerInnerArray) => {
          const { title, slug, formula } = innerInnerArray[1];
          const docsTarget = formula.keyFunction?.name ?? "";
          const docsHref = docsTarget
            ? `/api?tab=documentation&fn=${encodeURIComponent(docsTarget)}`
            : "";

          tempArray.push(
              <div
                key={`createjson-dd-${slug}`}
                className="individual-checklist-item"
              >
                {clickHandler !== null ? (
                  <div
                    className={
                      location.pathname.includes(slug)
                        ? "checklist-div active"
                        : "checklist-div"
                    }
                    onClick={() => navigate(`/examples/${slug}`)}
                  >
                    <Link className="example-checklist-link" to={`/examples/${slug}`}>
                      <div className="hover-anim"></div>
                      <div className="link-name">{title}</div>
                    </Link>
                    {/* Actions stop propagation so the box-wide click above can't
                        clobber their own destinations (docs → /api, full function
                        → carries openCode state). */}
                    <div
                      className="example-checklist-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {docsHref && (
                        <Link className="checklist-mini-link" to={docsHref}>
                          docs
                        </Link>
                      )}
                      <Link
                        className="checklist-mini-link"
                        to={`/examples/${slug}`}
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
                      idAttribute={`${slug}`}
                    />
                    <label htmlFor={`${slug}`}>{title}</label>
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
            open={query !== "" ? index : open}
            index={index}
            test={(i: number) => {
              const nextOpen = open === i ? -1 : i;
              if (setOpen) setOpen(nextOpen);
              if (clickHandler && nextOpen !== -1 && firstEntry) {
                const [itemKey, itemVal] = firstEntry as [string, any];
                clickHandler(`/examples/${itemVal.slug}`, innerArray[0], itemKey);
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
          {filter && (
            <div className="checklist-filter">
              <input
                type="search"
                value={filter.query}
                onChange={(e) => filter.setQuery(e.target.value)}
                placeholder="Filter animations…"
                aria-label="Filter animations"
              />
            </div>
          )}
          {query !== "" && returnArray.length === 0 ? (
            <p className="checklist-no-matches">
              No animations match “{filter?.query.trim()}”.
            </p>
          ) : (
            returnArray
          )}
        </div>
      );
    },
    [location, navigate]
  );

  return { createChecklist };
}

export default CreateChecklists;
