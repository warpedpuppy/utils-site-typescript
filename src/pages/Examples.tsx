import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PrimaryCanvas from "../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../components/SideBar/SideBar";
import ProcessSiteData from "../utils/ProcessSiteData";
import "./Examples.scss";

function Examples() {
  const params = useParams();
  const [activeFunction, setActiveFunction] = useState<string>("");

  type SiteDataType = {
    [key: string]: InnerSiteDataType;
  };
  type InnerSiteDataType = {
    [key: string]: object;
  };

  const loadCode: Function = (key: string, innerKey: string) => {
    let test: SiteDataType = siteData;
    console.log(test[key][innerKey]);
    setActiveFunction(key);
  };
  const { sideMenu, siteData } = ProcessSiteData(loadCode);

  useEffect(() => {
    console.log(params, siteData);
  }, [params, siteData]);

  return (
    <section id="home-page">
      <SideBar sideMenu={sideMenu} />
      <PrimaryCanvas activeFunction={activeFunction} />
    </section>
  );
}

export default Examples;
