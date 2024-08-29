import { CollisionDetectionObject } from "../../../types/types";

function JSONCheckbox({
  t,
  bool,
  clickHandler,
  keyFunction,
  className,
  animationObject,
}: {
  t: string;
  bool: boolean;
  clickHandler: Function;
  keyFunction: Function;
  className: string;
  animationObject: CollisionDetectionObject;
}) {
  return (
    <dd className="json-dd">
      <input
        type="checkbox"
        checked={bool}
        onChange={() =>
          clickHandler(t, keyFunction, className, animationObject)
        }
      />
      <div>{t}</div>
    </dd>
  );
}

export default JSONCheckbox;
