import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PrimaryCanvas from "../../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../../components/SideBar/SideBar";
import ProcessSiteData from "../../siteData/ProcessSiteData";
import ExamplesUtils from "./ExamplesUtils";
import { Nullable } from "../../types/types";

import "./Examples.scss";

function Examples() {
  const location = useLocation();
  const [activeObject, setActiveObject] = useState<Nullable<any>>(null);
  const [key, setKey] = useState<string>("");
  const [innerKey, setInnerKey] = useState<string>("");
  const [className, setClassName] = useState<any>(null);
  const getKeyAndInnerKeyFromLocation = ExamplesUtils();
  const { sideMenu, siteData } = ProcessSiteData(
    setClassName,
    location.pathname
  );

  useEffect(() => {
    setActiveObject(className);
  }, [className]);

  useEffect(() => {
    const { returnKey, returnInnerKey } = getKeyAndInnerKeyFromLocation(
      siteData,
      location.pathname
    );
    setKey(returnKey);
    setInnerKey(returnInnerKey);
  }, [getKeyAndInnerKeyFromLocation, siteData, location]);

  useEffect(() => {
    if (!key && !innerKey) return;
    let objectKey = key as keyof object;
    let objectInnerKey = innerKey as keyof object;
    let classRef: any = siteData[objectKey][objectInnerKey];
    let instance = new classRef();
    setClassName(instance);
  }, [key, innerKey, siteData]);

  return (
    <section id="home-page">
      <SideBar sideMenu={sideMenu} />
      <PrimaryCanvas activeObject={activeObject} />
    </section>
  );
}

export default Examples;
