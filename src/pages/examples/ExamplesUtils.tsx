import { useCallback } from "react";
import { AnimationClassRef, AnimationInstance } from "../../types/types";
import type { AnimationManifest } from "../../animationManifest";

export function getKeyAndInnerKeyFromSlug(
  siteData: AnimationManifest,
  exampleSlug: string
) {
  let key: keyof typeof siteData;
  let returnKey: string = "";
  let returnInnerKey: string = "";

  for (key in siteData) {
    const subObject = siteData[key];
    let innerKey: keyof typeof subObject;
    for (innerKey in subObject) {
      const { slug } = subObject[innerKey];
      if (exampleSlug === slug) {
        returnKey = key;
        returnInnerKey = innerKey;
        return { returnKey, returnInnerKey };
      }
    }
  }

  return { returnKey, returnInnerKey };
}

function ExamplesUtils() {
  const getKeyAndInnerKeyFromRouteSlug = useCallback(
    (siteData: AnimationManifest, exampleSlug: string) =>
      getKeyAndInnerKeyFromSlug(siteData, exampleSlug),
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

  return { getKeyAndInnerKeyFromRouteSlug, createClassReference };
}

export default ExamplesUtils;
