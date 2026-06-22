import { CollisionDetectionObject } from "../../../../types/types";
import { starVertices as DrawStarFn } from "@utilspalooza/core/Star";
import StarSource from "@utilspalooza/core/Star.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const StarObject: CollisionDetectionObject = {
  keyFunction: DrawStarFn,
  dependencies: [],
  functionString: extractFunctionString(StarSource),
};

// export class Star {
//   ctx: CanvasRenderingContext2D;
//   spikes: number;
//   outerRadius: number;
//   innerRadius: number;
//   angle: number = 0;
//   rotate: boolean = false;
//   id: string = "";
//   drag: boolean = false;
//   vertices: any[] = [];
//   rot: number = 0;
//   step: number = 0;
//   star: Polygon = { vertices: [], draw: () => {}, drag: false };
//   centerPoint: Point;
//   constructor(
//     spikes: number,
//     outerRadius: number,
//     innerRadius: number,
//     angle: number = 0,
//     ctx: any,
//     rotate: boolean = false,
//     id: string = "",
//     centerPoint: Point = { x: 0, y: 0 }
//   ) {
//     this.spikes = spikes;
//     this.outerRadius = outerRadius;
//     this.innerRadius = innerRadius;
//     this.angle = angle;
//     this.ctx = ctx;
//     this.rotate = rotate;
//     this.id = id;
//     this.rot = (Math.PI / 2) * 3;
//     this.centerPoint = centerPoint;
//     this.step = Math.PI / spikes;
//   }
//   getStar() {
//     return this.star;
//   }
//   draw(
//     top: number,
//     left: number,
//     centerPoint: Point = { x: 0, y: 0 },
//     mousePoint: Point = { x: 0, y: 0 }
//   ) {
//     let {
//       spikes,
//       angle,
//       rot,
//       outerRadius,
//       star,
//       step,
//       innerRadius,
//       rotate,
//       ctx,
//     } = this;
//     ctx.beginPath();
//     centerPoint =
//       centerPoint.x !== 0 && centerPoint.y !== 0
//         ? centerPoint
//         : this.centerPoint;
//     if (!this.drag) mousePoint = { x: 0, y: 0 };
//     this.star.vertices = [];
//     for (let i = 0; i < spikes; i++) {
//       let x =
//         centerPoint.x +
//         Math.cos(angle + rot) * outerRadius +
//         mousePoint.x -
//         left;
//       let y =
//         centerPoint.y +
//         Math.sin(angle + rot) * outerRadius +
//         mousePoint.y -
//         top;

//       if (i === 0) {
//         ctx.moveTo(x + left, y + top);
//       } else {
//         ctx.lineTo(x + left, y + top);
//       }
//       star.vertices.push({ x: x + left, y: y + top });
//       rot += step;
//       x =
//         centerPoint.x +
//         Math.cos(angle + rot) * innerRadius +
//         mousePoint.x -
//         left;
//       y =
//         centerPoint.y +
//         Math.sin(angle + rot) * innerRadius +
//         mousePoint.y -
//         top;
//       this.star.vertices.push({ x: x + left, y: y + top });
//       ctx.lineTo(x + left, y + top);
//       rot += step;
//     }
//     if (rotate) {
//       this.angle += 0.01;
//       if (this.angle > 2 * Math.PI) this.angle = 0;
//     }
//     ctx.closePath();
//     ctx.stroke();
//     this.star = star;
//   }
// }
