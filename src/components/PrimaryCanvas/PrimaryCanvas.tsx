import { useMemo } from "react";

import ExamplesUtils from "../../pages/examples/ExamplesUtils";
import "./PrimaryCanvas.scss";

import CanvasContainer from "./CanvasContainer";

function PrimaryCanvas(props: any) {
  const { siteData }: { siteData: object } = props;

  const activeObject: string[] = props.activeObject;

  const { createClassReference } = ExamplesUtils();

  const instanceOfClass = useMemo(() => {
    if (!activeObject || !activeObject[0]) return;
    let str1 = activeObject[0] as keyof object;
    let str2 = activeObject[1] as keyof object;
    let classRef = createClassReference(siteData[str1][str2]);
    return classRef;
  }, [activeObject, createClassReference, siteData]);

  return <CanvasContainer instance={instanceOfClass} />;
}

export default PrimaryCanvas;
