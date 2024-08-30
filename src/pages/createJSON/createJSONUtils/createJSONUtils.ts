import { useEffect, useState } from "react";
import SiteData from "../../../siteData/SiteData";
import LocalStorageManager from "../../../services/LocalStorageManager";

export function CreateJson() {
  const { getLocalStorageAsArray } = LocalStorageManager();
  const [json, setJson] = useState<any>([]);
  const [content, setContent] = useState<any>([]);
  useEffect(() => {
    let temp: any = getLocalStorageAsArray();
    Object.entries(SiteData).forEach((item) => {
      Object.entries(item[1]).forEach((subItem) => {
        // setContent([...content, subItem[1].f]);
      });
    });
  }, [getLocalStorageAsArray]);

  return json;
}
