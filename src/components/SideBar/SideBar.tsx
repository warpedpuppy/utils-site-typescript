import { useState, useEffect, ReactNode } from "react";
import Utils from "../../utils/Utils";
import { NavLink } from "react-router-dom";
import "./SideBar.scss";

type IndividualExample = {
  t: string;
  l: string;
  f: any;
};
type LargerCategory = {
  [key: string]: IndividualExample;
};

function SideBar() {
  const [sideMenu, setSideMenu] = useState<Array<ReactNode>>([]);
  useEffect(() => {
    let arr = [];
    let key: keyof typeof Utils;

    for (key in Utils) {
      arr.push(<dt key={`sidemenu-dt-${key}`}>{key}</dt>);

      const subObject: LargerCategory = Utils[key];
      let innerKey: keyof typeof subObject;

      for (innerKey in subObject) {
        let { t, l } = subObject[innerKey];
        arr.push(
          <dd key={`sidemenu-dd-${innerKey}`}>
            <NavLink
              to={l}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              {t}
            </NavLink>
          </dd>
        );
      }
    }
    setSideMenu(arr);
  }, []);

  return <dl id="side-bar">{sideMenu}</dl>;
}

export default SideBar;
