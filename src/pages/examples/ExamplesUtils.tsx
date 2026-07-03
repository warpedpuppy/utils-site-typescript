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
  const createClassReference = useCallback((f: Function) => {
    // had to nest the class in an object because it was instantiating it when it was placed in a useState variable
    let classRef: any = f;
    function create(ctor: {
      new (canvasCont: any): typeof classRef;
    }): typeof classRef {
      let obj = {
        initiate: (canvasCont: any) => new ctor(canvasCont),
      };
      return obj;
    }
    return create(classRef);
  }, []);

  return { getKeyAndInnerKeyFromLocation, createClassReference };
}

export default ExamplesUtils;
