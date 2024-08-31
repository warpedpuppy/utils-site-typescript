import { useMemo } from "react";
import LocalStorageManager from "../../../services/LocalStorageManager";
export function CreateJson() {
  const { getLocalStorageAsArray } = LocalStorageManager();
  let value = useMemo(() => {
    let arrayOfFormulas: any = getLocalStorageAsArray();
    let str = ``;
    arrayOfFormulas.forEach(
      (item: string) =>
        (str += `
      ${item}`)
    );
    return str;
  }, [getLocalStorageAsArray]);

  return value;
}
