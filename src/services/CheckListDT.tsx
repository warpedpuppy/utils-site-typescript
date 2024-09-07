import { useState } from "react";

function CheckListDT({ innerText }: { innerText: string }) {
  const [open, setOpen] = useState<string>("");
  return (
    <dt
      className={open}
      onClick={() => setOpen(open === "" ? "open" : "")}
      key={`createjson-dt-${innerText}`}
    >
      {innerText}
    </dt>
  );
}

export default CheckListDT;
