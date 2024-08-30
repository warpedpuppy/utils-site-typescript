import { useMemo, useState, useCallback } from "react";
import SiteData from "./SiteData";
import { useNavigate } from "react-router-dom";
import { GenericObject } from "../types/types";

function ProcessUtils(setClassName: Function, location: string) {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>("");

  const loadCode = useCallback(
    (key: string, innerKey: string) => {
      if (!key && !innerKey) return;
      let objectKey = key as keyof object;
      let objectInnerKey = innerKey as keyof object;
      setClassName([objectKey, objectInnerKey]);
    },
    [setClassName]
  );

  const sideMenu = useMemo(() => {
    let arr = [];
    let key: keyof typeof SiteData;
    function clickHandler(str: string, key: string, innerKey: string) {
      loadCode(key, innerKey);
      navigate(str);
      setActiveLink(innerKey);
    }
    for (key in SiteData) {
      if (key === "simple useful equations") continue;
      arr.push(<dt key={`sidemenu-dt-${key}`}>{key}</dt>);
      let BigCat: string = key.toString();
      const subObject: GenericObject = SiteData[key];
      let innerKey: keyof typeof subObject;

      for (innerKey in subObject) {
        let { t, l } = subObject[innerKey];
        let LittleCat: string = innerKey.toString();
        let active = location.includes(l);
        arr.push(
          <dd
            key={`sidemenu-dd-${innerKey}`}
            className={activeLink === LittleCat || active ? "active" : ""}
          >
            <input type="checkbox" />
            <div
              onClick={() => clickHandler(`/examples/${l}`, BigCat, LittleCat)}
            >
              {t}
            </div>
          </dd>
        );
      }
    }
    return arr;
  }, [loadCode, navigate, activeLink, location]);

  return { sideMenu, siteData: SiteData };
}

export default ProcessUtils;
