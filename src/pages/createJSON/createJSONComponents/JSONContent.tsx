import { CreateJson } from "../createJSONUtils/createJSONUtils";
import "./JSONContent.scss";

function JSONContent() {
  let formattedJSON: any = CreateJson();

  return (
    <pre>
      <code>{formattedJSON}</code>
    </pre>
  );
}

export default JSONContent;
