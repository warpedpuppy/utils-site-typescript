import { useMemo } from "react";
import SiteData from "./SiteData";
import { useNavigate } from "react-router-dom";

type LargerCategory = {
  [key: string]: IndividualExample;
};

type IndividualExample = {
  t: string;
  l: string;
  bf: Function;
  f: any;
};

function ProcessUtils(loadCode: Function) {
  const navigate = useNavigate();

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
    }
    for (key in SiteData) {
      arr.push(<dt key={`sidemenu-dt-${key}`}>{key}</dt>);
      let BigCat: string = key.toString();
      const subObject: LargerCategory = SiteData[key];
      let innerKey: keyof typeof subObject;

      for (innerKey in subObject) {
        let { t, l, f } = subObject[innerKey];
        let LittleCat: string = innerKey.toString();
        arr.push(
          <dd key={`sidemenu-dd-${innerKey}`}>
            <div
              onClick={() =>
                clickHandler(`/examples/${l}`, f, BigCat, LittleCat)
              }
            >
              {t}
            </div>
          </dd>
        );
      }
    }
    return arr;
  }, [loadCode, navigate]);

  return { sideMenu, siteData: SiteData };
}

export default ProcessUtils;
