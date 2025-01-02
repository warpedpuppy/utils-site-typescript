import { Nullable } from "../types/types";
function CheckListDT({
  innerText,
  open,
  index,
  test,
}: {
  innerText: string;
  open: Nullable<number>;
  index: Nullable<number>;
  test: Nullable<Function>;
}) {
  return (
    <div
      className={`checklist-catogory ${open === index ? "open" : ""}`}
      onClick={() => {
        if (test) test(open === index ? 10 : index);
      }}
      key={`createjson-dt-${innerText}`}
    >
      {innerText}
    </div>
  );
}

export default CheckListDT;
