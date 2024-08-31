import { CreateJson } from "../createJSONUtils/createJSONUtils";
import "./JSONContent.scss";

function JSONContent() {
  let formattedJSON: any = CreateJson();

  return <pre>{formattedJSON}</pre>;
}

export default JSONContent;
