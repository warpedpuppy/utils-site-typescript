import { useMemo } from "react";
import LocalStorageManager from "../../../services/LocalStorageManager";
import SiteData from "../../../siteData/SiteData";
export function CreateJson() {
  const { getLocalStorageAsArray } = LocalStorageManager();
  let value = useMemo(() => {
    let arrayOfFormulas: any = getLocalStorageAsArray();
    let set = new Set();
    let str = ``;

    Object.values(SiteData).forEach((objects) => {
      Object.entries(objects).forEach((keyValues) => {
        if (arrayOfFormulas.includes(keyValues[0])) {
          // str += keyValues[1].f.functionString;
          set.add(keyValues[1].f.functionString);
          keyValues[1].f.dependencies.forEach((dependency: string) => {
            // str += dependency;
            set.add(dependency);
          });
        }
      });
    });

    set.forEach((item) => {
      str += item;
    });

    return str;
  }, [getLocalStorageAsArray]);

  return value;
}
