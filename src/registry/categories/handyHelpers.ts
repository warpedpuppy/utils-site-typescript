import { RegistryRecord } from "../types";

import { degToRad } from "../../pages/createJSON/formulas/simpleEquations/DegToRad";
import { radToDeg } from "../../pages/createJSON/formulas/simpleEquations/RadToDeg";
import { numberWithCommas } from "../../pages/createJSON/formulas/simpleEquations/NumberWIthCommas";
import { randomIntegerBetween } from "../../pages/createJSON/formulas/simpleEquations/RandomIntegerBetween";
import { randomNumberBetween } from "../../pages/createJSON/formulas/simpleEquations/RandomNumberBetween";
import { lerpColor as lerpColorFormula } from "../../pages/createJSON/formulas/usefulLittleThings/LerpColor";
import { colorFamilyFormula } from "../../pages/createJSON/formulas/usefulLittleThings/ColorFamily";

export const HANDY_HELPERS: RegistryRecord[] = [
  {
    slug: "degrees-to-radians",
    title: "degrees to radians",
    category: "handy helpers",
    manifestKey: "Deg2RadAnimation",
    formula: degToRad,
    load: () => import("../../core-animations/DegToRadAnimation"),
    coreExports: ["degToRad"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "radians-to-degrees",
    title: "radians to degrees",
    category: "handy helpers",
    manifestKey: "Rad2DegAnimation",
    formula: radToDeg,
    load: () => import("../../core-animations/Rad2DegAnimation"),
    coreExports: ["radToDeg"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "format-number-with-commas",
    title: "format number with commas",
    category: "handy helpers",
    manifestKey: "NumberWithCommasAnimation",
    formula: numberWithCommas,
    load: () => import("../../core-animations/NumberWithCommasAnimation"),
    coreExports: ["numberWithCommas"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "random-integer-between",
    title: "random integer between",
    category: "handy helpers",
    manifestKey: "RandomIntegerAnimation",
    formula: randomIntegerBetween,
    load: () => import("../../core-animations/RandomIntegerAnimation"),
    coreExports: ["randomIntegerBetween"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "random-number-between",
    title: "random number between",
    category: "handy helpers",
    manifestKey: "RandomNumberAnimation",
    formula: randomNumberBetween,
    load: () => import("../../core-animations/RandomNumberAnimation"),
    coreExports: ["randomNumberBetween"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "color-lerp",
    title: "color lerp (RGB vs HSL)",
    category: "handy helpers",
    manifestKey: "ColorLerpAnimation",
    formula: lerpColorFormula,
    load: () => import("../../core-animations/ColorLerp"),
    coreExports: ["lerpColor", "lerpColorHsl", "rgbToCss", "rgbToHsl", "hslToRgb"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "color-families",
    title: "color families (pick a range by name)",
    category: "handy helpers",
    manifestKey: "ColorFamiliesAnimation",
    formula: colorFamilyFormula,
    load: () => import("../../core-animations/ColorFamilies"),
    coreExports: ["colorFamily", "getRandomColors", "rgbToCss"],
    pen: "canonical-vm-tested",
  },
];
