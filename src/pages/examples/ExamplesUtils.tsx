import { useCallback } from "react";
import { AnimationClassRef, AnimationInstance } from "../../types/types";
import type { AnimationManifest } from "../../animationManifest";
function ExamplesUtils() {
  const getKeyAndInnerKeyFromLocation = useCallback(
    (siteData: AnimationManifest, location: string) => {
      let key: keyof typeof siteData;
      let forceBreak: boolean = false;
      let returnKey: string = "";
      let returnInnerKey: string = "";
      for (key in siteData) {
        const subObject = siteData[key];
        let innerKey: keyof typeof subObject;
        for (innerKey in subObject) {
          let { slug } = subObject[innerKey];
          if (location.includes(slug)) {
            forceBreak = true;
            returnKey = key;
            returnInnerKey = innerKey;
            break;
          }
        }
        if (forceBreak) break;
      }
      return { returnKey, returnInnerKey };
    },
    []
  );
  const createClassReference = useCallback(
    // Nested in an object because useState would instantiate a bare class.
    (ctor: new (containerId: string) => unknown): AnimationClassRef => ({
      initiate: (containerId: string) =>
        new ctor(containerId) as AnimationInstance,
    }),
    []
  );

  return { getKeyAndInnerKeyFromLocation, createClassReference };
}

export default ExamplesUtils;
