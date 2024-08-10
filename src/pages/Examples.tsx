import { useState, useEffect } from "react";
import PrimaryCanvas from "../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../components/SideBar/SideBar";
import ProcessSiteData from "../utils/ProcessSiteData";
import "./Examples.scss";

function Examples() {
  const [activeObject, setActiveObject] = useState<IndividualObject>({
    t: "",
    l: "",
    end: () => {},
    bf: () => {},
    f: () => {},
  });

  type SiteDataType = {
    [key: string]: object;
  };
  type InnerSiteDataType = {
    [key: string]: object;
  };

  type IndividualObject = {
    bf: Function;
    end: Function;
    t: string;
    l: string;
    f: Function;
  };

  const loadCode: Function = (key: keyof object, innerKey: keyof object) => {
    setActiveObject(siteData[key][innerKey]);
  };
  const { sideMenu, siteData } = ProcessSiteData(loadCode);

  return (
    <section id="home-page">
      <SideBar sideMenu={sideMenu} />
      <PrimaryCanvas activeObject={activeObject} />
    </section>
  );
}

export default Examples;
