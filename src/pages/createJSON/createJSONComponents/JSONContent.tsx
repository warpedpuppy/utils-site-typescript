import { CreateJson } from "../createJSONUtils/createJSONUtils";
import "./JSONContent.scss";

function JSONContent() {
  let formattedJSON: any = CreateJson();

  if (!formattedJSON) {
    return (
      <div className="text-container-div">
        <p>There are no functions here!</p>
      </div>
    );
  }
  return <pre className="functions-pre">{formattedJSON}</pre>;
}

export default JSONContent;
