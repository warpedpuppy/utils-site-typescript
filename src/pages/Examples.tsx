import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PrimaryCanvas from "../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../components/SideBar/SideBar";
import ProcessSiteData from "../utils/ProcessSiteData";
import "./Examples.scss";

function Examples() {
  const params = useParams();
  const [activeObject, setActiveObject] = useState<object>({});

  type SiteDataType = {
    [key: string]: InnerSiteDataType;
  };
  type InnerSiteDataType = {
    [key: string]: object;
  };

  const loadCode: Function = (key: string, innerKey: string) => {
    let test: SiteDataType = siteData;
    setActiveObject(test[key][innerKey]);
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
