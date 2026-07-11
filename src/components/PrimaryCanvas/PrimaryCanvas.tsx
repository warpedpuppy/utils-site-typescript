import { useEffect, useState } from "react";

import ExamplesUtils from "../../pages/examples/ExamplesUtils";
import "./PrimaryCanvas.scss";

import CanvasContainer from "./CanvasContainer";
import { AnimationManifestEntry } from "../../animationManifest";
import { AnimationClassRef } from "../../types/types";

function PrimaryCanvas({
  activeObject,
}: {
  activeObject: AnimationManifestEntry | null;
}) {
  const { createClassReference } = ExamplesUtils();
  const [instanceOfClass, setInstanceOfClass] = useState<AnimationClassRef>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setInstanceOfClass(undefined);
    if (!activeObject) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    activeObject
      .load()
      .then((module) => {
        if (!isCurrent) return;
        setInstanceOfClass(createClassReference(module.default));
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeObject, createClassReference]);

  return (
    <CanvasContainer
      instance={instanceOfClass}
      isLoading={isLoading}
      functionName={activeObject?.primaryCoreExport ?? null}
    />
  );
}

export default PrimaryCanvas;
