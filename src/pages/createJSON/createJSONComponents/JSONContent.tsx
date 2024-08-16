import { GenericObject } from "../../../types/types";
import "./JSONContent.scss";
function JSONContent({ json }: { json: GenericObject }) {
  return (
    <>
      {Object.keys(json).map((item: string, key) => {
        let obj: Function = json[item];
        return (
          <div key={`json-values-${key}`}>
            <pre> {item.toString()} </pre>
            <pre> {obj.toString()} </pre>
          </div>
        );
      })}
    </>
  );
}

export default JSONContent;
