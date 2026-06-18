import { CollisionDetectionObject } from "../../../../types/types";
import { LineLength } from "./LineLength";
import { GetRotation } from "./GetRotation";
import { CreateRect as CreateRectFn } from "../../../../core-functions/Rectangle";
import RectangleSource from "../../../../core-functions/Rectangle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const RectangleObject: CollisionDetectionObject = {
  keyFunction: CreateRectFn,
  dependencies: [LineLength.functionString, GetRotation.functionString],
  functionString: extractFunctionString(RectangleSource),
};
