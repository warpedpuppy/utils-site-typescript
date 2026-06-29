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
    setOpen
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
  }, [getKeyAndInnerKeyFromLocation, location]);

  useEffect(() => {
    if (!key && !innerKey) return;
    let objectKey = key as keyof object;
    let objectInnerKey = innerKey as keyof object;
    setClassName([objectKey, objectInnerKey]);
  }, [key, innerKey]);

  return (
    <section id="example-page">
      <Helmet>
        <title>Animation Examples — Utilspalooza</title>
        <meta name="description" content="Browse live canvas animation demos: ball bounce, collision detection, bezier curves, sine waves, easing, and more. Click any formula to see it animate in real time." />
        <link rel="canonical" href="https://utilspalooza.com/examples" />
        <meta property="og:url" content="https://utilspalooza.com/examples" />
        <meta property="og:title" content="Animation Examples — Utilspalooza" />
      </Helmet>
      {checklist}
      <PrimaryCanvas activeObject={activeObject} />
    </section>
  );
}

export default Examples;
