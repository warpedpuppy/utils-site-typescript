import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PrimaryCanvas from "../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../components/SideBar/SideBar";
import ProcessSiteData from "../siteData/ProcessSiteData";
import { AnimationObject } from "../types/types";
import "./Examples.scss";

function Examples() {
  const location = useLocation();

  useEffect(() => {}, [location]);

  const [activeObject, setActiveObject] = useState<AnimationObject>({
    t: "",
    l: "",
    bf: () => {},
    f: () => {},
  });
  const { sideMenu, siteData } = ProcessSiteData(loadCode);

  function loadCode(key: keyof object, innerKey: keyof object) {
    setActiveObject(siteData[key][innerKey]);
  }

  return (
    <section id="home-page">
      <SideBar sideMenu={sideMenu} />
      <PrimaryCanvas activeObject={activeObject} />
    </section>
  );
}

export default Examples;
