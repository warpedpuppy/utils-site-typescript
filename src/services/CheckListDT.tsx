import { useState } from "react";

function CheckListDT({ innerText }: { innerText: string }) {
  const [open, setOpen] = useState<string>("");
  return (
    <div
      className={`checklist-catogory ${open}`}
      onClick={() => setOpen(open === "" ? "open" : "")}
      key={`createjson-dt-${innerText}`}
    >
      {innerText}
    </div>
  );
}

export default CheckListDT;
