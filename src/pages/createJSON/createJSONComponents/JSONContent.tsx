import { CreateJson } from "../createJSONUtils/createJSONUtils";
import "./JSONContent.scss";

function JSONContent() {
  let formattedJSON: any = CreateJson();

  return <pre className="functions-pre">{formattedJSON}</pre>;
}

export default JSONContent;
