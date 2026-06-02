import { useRef, useEffect } from "react";
import LocalStorageManager from "./LocalStorageManager";

function CheckListCheckbox({
  objectProperty,
  idAttribute,
}: {
  objectProperty: string;
  idAttribute: string;
}) {
  let checkbox = useRef<HTMLInputElement>(null);
  const { addToLocaStorage, deleteFromLocaStorage, isInLocalStorage } =
    LocalStorageManager();

  useEffect(() => {
    //check upon page load
    if (isInLocalStorage(objectProperty) && checkbox.current)
      checkbox.current.checked = true;
  }, [isInLocalStorage, objectProperty]);

  function changeHandler() {
    if (isInLocalStorage(objectProperty)) {
      deleteFromLocaStorage(objectProperty);
    } else {
      addToLocaStorage(objectProperty);
    }
    window.dispatchEvent(new CustomEvent("formulaSelectionChanged"));
  }
  function mouseEnterHandler() {
    console.log("enter");
    //show tooltip
  }
  function mouseLeaveHander() {
    console.log("leave");
    //hide tooltip
  }

  return (
    <input
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHander}
      type="checkbox"
      id={idAttribute}
      ref={checkbox}
      onChange={changeHandler}
    />
  );
}

export default CheckListCheckbox;
