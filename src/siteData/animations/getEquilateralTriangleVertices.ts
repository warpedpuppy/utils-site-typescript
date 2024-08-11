import { Point, GenericObject } from "../../types/types";
const equilateralTriangleVertices = {
  t: "get equilateral triangle vertices from radius and center point",
  l: "equilateral-trianlge-points",
  f: function (radius: number, centerPoint: Point) {
    let point1 = { x: radius * Math.cos(0) + centerPoint.x, y: radius * Math.sin(0) + centerPoint.y }
    let point2 = { x: radius * Math.cos((1 / 3) * (2 * Math.PI)) + centerPoint.x, y: radius * Math.sin((1 / 3) * (2 * Math.PI)) + centerPoint.y }
    let point3 = { x: radius * Math.cos((2 / 3) * (2 * Math.PI)) + centerPoint.x, y: radius * Math.sin((2 / 3) * (2 * Math.PI)) + centerPoint.y }
    return { point1, point2, point3 }
  },
  bf: function (cont: HTMLDivElement) {
    let obj: GenericObject = {
      init() {
        this.canvas = document.createElement("canvas");
        cont.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("pointerdown", this.pointerDownHandler)
      },
      pointerDownHandler(e: PointerEvent) {
        console.log(e, "equilateral trianlge")

      },
      stop() {
        this.canvas.removeEventListener("pointerdown", this.pointerDownHandler)
      }
    }
    return obj;
  }
}
export default equilateralTriangleVertices;