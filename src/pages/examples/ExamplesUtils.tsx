import { useCallback } from "react";
import { GenericObject } from "../../types/types";
function ExamplesUtils() {
  const getKeyAndInnerKeyFromLocation = useCallback(
    (siteData: GenericObject, location: string) => {
      let key: keyof typeof siteData;
      let forceBreak: boolean = false;
      let returnKey: string = "";
      let returnInnerKey: string = "";
      for (key in siteData) {
        const subObject: GenericObject = siteData[key];
        let innerKey: keyof typeof subObject;
        for (innerKey in subObject) {
          let { l } = subObject[innerKey];
          if (location.includes(l)) {
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

  return getKeyAndInnerKeyFromLocation;
}

export default ExamplesUtils;
