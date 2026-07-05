import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import PrimaryCanvas from "../../components/PrimaryCanvas/PrimaryCanvas";
import ExamplesUtils from "./ExamplesUtils";
import { Nullable } from "../../types/types";
import CreateChecklists from "../../services/CreateChecklists";
import { useNavigate } from "react-router-dom";
import "./Examples.scss";
import { useParams } from "react-router-dom";
import animationManifest, {
  AnimationManifestEntry,
} from "../../animationManifest";

function Examples() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exampleName } = useParams();
  const [activeObject, setActiveObject] =
    useState<Nullable<AnimationManifestEntry>>(null);
  const [key, setKey] = useState<string>("");
  const [innerKey, setInnerKey] = useState<string>("");
  const [className, setClassName] = useState<any>(["", ""]);
  const [open, setOpen] = useState<number>(-1);
  const [filterQuery, setFilterQuery] = useState<string>("");

  const { getKeyAndInnerKeyFromLocation } = ExamplesUtils();
  const { createChecklist } = CreateChecklists();

  useEffect(() => {
    if (!exampleName) {
      navigate("/examples/ball-bounce", { replace: true });
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
    setOpen,
    { query: filterQuery, setQuery: setFilterQuery }
  );

  useEffect(() => {
    if (!className[0]) return;
    const category = className[0] as keyof typeof animationManifest;
    const itemKey = className[1] as string;
    setActiveObject(animationManifest[category]?.[itemKey] ?? null);
  }, [className]);

  useEffect(() => {
    const { returnKey, returnInnerKey } = getKeyAndInnerKeyFromLocation(
      animationManifest,
      location.pathname
    );
    setKey(returnKey);
    setInnerKey(returnInnerKey);
    if (returnKey) {
      setOpen(Object.keys(animationManifest).indexOf(returnKey));
    }
  }, [getKeyAndInnerKeyFromLocation, location]);

  useEffect(() => {
    if (!key && !innerKey) return;
    let objectKey = key as keyof object;
    let objectInnerKey = innerKey as keyof object;
    setClassName([objectKey, objectInnerKey]);
  }, [key, innerKey]);

  const pageTitle = activeObject
    ? `${activeObject.title} — Canvas Animation Example — Utilspalooza`
    : "Animation Examples — Utilspalooza";
  const pageUrl = activeObject
    ? `https://utilspalooza.com/examples/${activeObject.slug}`
    : "https://utilspalooza.com/examples";

  return (
    <section id="example-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Browse live canvas animation demos: ball bounce, collision detection, bezier curves, sine waves, easing, and more. Click any formula to see it animate in real time." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
      </Helmet>
      <h1 className="sr-only">
        {activeObject
          ? `${activeObject.title} — live canvas animation example`
          : "Animation examples"}
      </h1>
      {checklist}
      <PrimaryCanvas activeObject={activeObject} />
    </section>
  );
}

export default Examples;
