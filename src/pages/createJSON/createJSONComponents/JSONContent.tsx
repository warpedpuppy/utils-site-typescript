import { useEffect, useState } from "react";
import { GenericObject } from "../../../types/types";
import { CreateJson } from "../createJSONUtils/createJSONUtils";
import "./JSONContent.scss";
function JSONContent({ json }: { json: GenericObject }) {
  const [utilsPrintOut, setUtilsPrintOut] = useState<string>("");
  let formattedJSON: string = CreateJson();

  if (!Object.keys(json).length) return <div>nada</div>;

  return (
    <div>
      <pre>{utilsPrintOut}</pre>
    </div>
  );
}

export default JSONContent;
