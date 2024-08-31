import { useMemo } from "react";
import LocalStorageManager from "../../../services/LocalStorageManager";
import SiteData from "../../../siteData/SiteData";
export function CreateJson() {
  const { getLocalStorageAsArray } = LocalStorageManager();
  let value = useMemo(() => {
    let arrayOfFormulas: any = getLocalStorageAsArray();
    let str = ``;

    Object.values(SiteData).forEach((objects) => {
      Object.entries(objects).forEach((keyValues) => {
        if (arrayOfFormulas.includes(keyValues[0])) {
          str += keyValues[1].f.functionString;
          keyValues[1].f.dependencies.forEach((dependency: string) => {
            str += dependency;
          });
        }
      });
    });

    return str;
  }, [getLocalStorageAsArray]);

  return value;
}
