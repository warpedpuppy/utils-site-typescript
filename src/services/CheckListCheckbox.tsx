import { useRef, useEffect } from "react";
import LocalStorageManager from "./LocalStorageManager";

function CheckListCheckbox({
  idAttribute,
  functionName,
}: {
  idAttribute: string;
  functionName: string;
}) {
  let checkbox = useRef<HTMLInputElement>(null);
  const { addToLocaStorage, deleteFromLocaStorage, isInLocalStorage } =
    LocalStorageManager();

  useEffect(() => {
    //check upon page load
    if (isInLocalStorage(functionName) && checkbox.current)
      checkbox.current.checked = true;
  }, [isInLocalStorage, functionName]);

  function changeHandler() {
    if (isInLocalStorage(functionName)) {
      deleteFromLocaStorage(functionName);
    } else {
      addToLocaStorage(functionName);
    }
  }

  return (
    <input
      type="checkbox"
      id={idAttribute}
      ref={checkbox}
      onChange={changeHandler}
    />
  );
}

export default CheckListCheckbox;
