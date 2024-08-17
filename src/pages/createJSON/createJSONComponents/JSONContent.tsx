import { useEffect, useState } from "react";
import { GenericObject } from "../../../types/types";
import { createJson } from "../createJSONUtils/createJSONUtils";
import "./JSONContent.scss";
function JSONContent({ json }: { json: GenericObject }) {
  const [utilsPrintOut, setUtilsPrintOut] = useState<string>("");
  useEffect(() => {
    let formattedJSON: string = createJson(json);
    setUtilsPrintOut(formattedJSON);
  }, [json]);

  if (!Object.keys(json).length) return <div>nada</div>;

  return (
    <div>
      <pre>{utilsPrintOut}</pre>
    </div>
  );
}

export default JSONContent;
