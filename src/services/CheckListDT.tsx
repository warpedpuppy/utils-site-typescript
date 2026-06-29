import { Nullable } from "../types/types";
function CheckListDT({
  innerText,
  count,
  open,
  index,
  test,
}: {
  innerText: string;
  count?: number;
  open: Nullable<number>;
  index: Nullable<number>;
  test: Nullable<Function>;
}) {
  return (
    <div
      className={`checklist-category ${open === index ? "open" : ""}`}
      onClick={() => {
        if (test) test(open === index ? -1 : index);
      }}
      key={`createjson-dt-${innerText}`}
    >
      <span>{innerText}</span>
      {typeof count === "number" && <span className="category-count">{count}</span>}
      <span className="open-indicator">{open === index ? "-" : "+"} </span>
    </div>
  );
}

export default CheckListDT;
