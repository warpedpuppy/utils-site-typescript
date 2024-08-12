import { useMemo, useState } from "react";
import SiteData from "./SiteData";
import { useNavigate } from "react-router-dom";
import { GenericObject } from "../types/types";

function ProcessUtils(loadCode: Function) {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>("");

  const sideMenu = useMemo(() => {
    let arr = [];
    let key: keyof typeof SiteData;
    function clickHandler(
      str: string,
      f: Function,
      key: string,
      innerKey: string
    ) {
      loadCode(key, innerKey);
      navigate(str);
      setActiveLink(innerKey);
    }
    for (key in SiteData) {
      arr.push(<dt key={`sidemenu-dt-${key}`}>{key}</dt>);
      let BigCat: string = key.toString();
      const subObject: GenericObject = SiteData[key];
      let innerKey: keyof typeof subObject;

      for (innerKey in subObject) {
        let { t, l, f } = subObject[innerKey];
        let LittleCat: string = innerKey.toString();
        arr.push(
          <dd
            key={`sidemenu-dd-${innerKey}`}
            className={activeLink === LittleCat ? "active" : ""}
            onClick={() => clickHandler(`/examples/${l}`, f, BigCat, LittleCat)}
          >
            <div>{t}</div>
          </dd>
        );
      }
    }
    return arr;
  }, [loadCode, navigate, activeLink]);

  return { sideMenu, siteData: SiteData };
}

export default ProcessUtils;
