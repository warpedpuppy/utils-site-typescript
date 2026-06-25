import { CollisionDetectionObject } from "../../../../types/types";
import { boidsStep } from "@utilspalooza/core/Boids";
import BoidsSource from "@utilspalooza/core/Boids.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const BoidsObject: CollisionDetectionObject = {
  keyFunction: boidsStep,
  dependencies: [],
  interfaces: ["Vector"],
  functionString: extractFunctionString(BoidsSource),
};
