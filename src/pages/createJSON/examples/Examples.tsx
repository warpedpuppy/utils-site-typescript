import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PrimaryCanvas from "../../../components/PrimaryCanvas/PrimaryCanvas";
import ExamplesUtils from "./ExamplesUtils";
import { Nullable } from "../../../types/types";
import CreateChecklists from "../../../services/CreateChecklists";
import { useNavigate } from "react-router-dom";
import "./Examples.scss";
import { useParams } from "react-router-dom";
import SiteData from "../../../siteData/SiteData";

function Examples() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exampleName } = useParams();
  const [activeObject, setActiveObject] = useState<Nullable<any>>(null);
  const [key, setKey] = useState<string>("");
  const [innerKey, setInnerKey] = useState<string>("");
  const [className, setClassName] = useState<any>(["", ""]);
  const [open, setOpen] = useState<number>(10);

  const { getKeyAndInnerKeyFromLocation, createClassReference } =
    ExamplesUtils();
  const { createChecklist } = CreateChecklists();

  useEffect(() => {
    if (!exampleName) {
      navigate("/examples/ball-bounce");
    }
  }, [exampleName, navigate]);

  function clickHandler(str: string, key: string, innerKey: string) {
    // setOpen(10);
    loadCode(key, innerKey);
    navigate(str);
  }

  const loadCode = useCallback(
    (key: string, innerKey: string) => {
      if (!key && !innerKey) return;
      let objectKey = key as keyof object;
      let objectInnerKey = innerKey as keyof object;
      setClassName([objectKey, objectInnerKey]);
    },
    [setClassName]
  );

  let checklist = createChecklist(
    "example-page-checklist",
    clickHandler,
    open,
    setOpen
  );

  useEffect(() => {
    if (!className[0]) return;
    setActiveObject(className);
  }, [className, createClassReference]);

  useEffect(() => {
    const { returnKey, returnInnerKey } = getKeyAndInnerKeyFromLocation(
      SiteData,
      location.pathname
    );
    setKey(returnKey);
    setInnerKey(returnInnerKey);
  }, [getKeyAndInnerKeyFromLocation, location]);

  useEffect(() => {
    if (!key && !innerKey) return;
    let objectKey = key as keyof object;
    let objectInnerKey = innerKey as keyof object;
    setClassName([objectKey, objectInnerKey]);
  }, [key, innerKey]);

  return (
    <section id="example-page">
      {checklist}
      <PrimaryCanvas activeObject={activeObject} siteData={SiteData} />
    </section>
  );
}

export default Examples;
