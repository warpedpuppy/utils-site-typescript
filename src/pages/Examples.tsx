import { useState } from "react";
import PrimaryCanvas from "../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../components/SideBar/SideBar";
import ProcessSiteData from "../utils/ProcessSiteData";
import "./Examples.scss";

type IndividualObject = {
  bf: Function;
  t: string;
  l: string;
  f: Function;
};

function Examples() {
  const [activeObject, setActiveObject] = useState<IndividualObject>({
    t: "",
    l: "",
    bf: () => {},
    f: () => {},
  });

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
