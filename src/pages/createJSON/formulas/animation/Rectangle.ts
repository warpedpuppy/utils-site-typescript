import { CollisionDetectionObject } from "../../../../types/types";
import { lineLength } from "./LineLength";
import { getRotation } from "./GetRotation";
import { createRect as CreateRectFn } from "@utilspalooza/core/Rectangle";
import RectangleSource from "@utilspalooza/core/Rectangle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const RectangleObject: CollisionDetectionObject = {
  keyFunction: CreateRectFn,
  dependencies: [lineLength.functionString, getRotation.functionString],
  functionString: extractFunctionString(RectangleSource),
};
