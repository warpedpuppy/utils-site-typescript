import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

/*
 * Sierpinski Triangle — ported from the warpedpuppies portfolio "pretty little things".
 *
 * STATUS: SCAFFOLD. drawSierpinski() below is intentionally BLANK — Ted ports it.
 * Original tech: Pixi.js Graphics (pure vector — cleanest port)
 *
 * NOTES: Ted wants this one IMPROVED, not just ported. It's all PIXI.Graphics lines/triangles, so it maps directly to Canvas 2D moveTo/lineTo/stroke. A sierpinski vertex generator could be lifted to @utilspalooza/core later.
 *
 * The complete original source is at the BOTTOM of this file, commented out,
 * as the reference to port from. When drawSierpinski() is implemented, delete the
 * placeholder() call in init() so the real animation runs.
 */

const ELI5 = `TODO (Ted): write the ELI5 explainer for Sierpinski Triangle.`;

/**
 * drawSierpinski — self-contained Canvas 2D draw routine.
 * (The CodePen pens embed this via .toString(), so keep it dependency-free:
 *  no module-level imports referenced inside the body.)
 *
 * TODO (Ted): port the commented original source at the bottom of this file
 * into here. Blank for now.
 */
export function drawSierpinski(
  _ctx: CanvasRenderingContext2D,
  _width: number,
  _height: number
): void {
  // TODO: port me. See the commented original source at the bottom of this file.
}

const SierpinskiFormula: CollisionDetectionObject = {
  keyFunction: drawSierpinski,
  dependencies: [],
  functionString: `// TODO (Ted): port drawSierpinski() — see Sierpinski.ts`,
};

class Sierpinski extends Template {
  static t = "Sierpinski Triangle";
  static l = "sierpinski";
  static f = SierpinskiFormula;
  title = "Sierpinski Triangle";

  animationObject = SierpinskiFormula;
  animId = 0;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    // TODO (Ted): once drawSierpinski() is implemented, start the rAF loop here
    // (e.g. this.animate()) and remove the placeholder() call below.
    this.placeholder();
  }

  /** Temporary stand-in until drawSierpinski() is ported. Safe to delete then. */
  placeholder() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = "#888";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Sierpinski Triangle — port in progress", this.halfWidth, this.halfHeight);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#555";
    ctx.fillText(
      "scaffold: original source is commented in Sierpinski.ts",
      this.halfWidth,
      this.halfHeight + 24
    );
  }

  stop() {
    cancelAnimationFrame(this.animId);
    super.stop();
  }
}

export default Sierpinski;

/* ===========================================================================
 * ORIGINAL PORTFOLIO SOURCE — reference for the Canvas 2D port. NOT executed.
 * Tech: Pixi.js Graphics (pure vector — cleanest port)
 * From: ~/Sites/warpedpuppies/portfolio/src/components/pretty-little-things/
 * ===========================================================================
// ── sierpinski/code/sierpinski-animation.js ───────────────────────────────
// import * as PIXI from "pixi.js";
// 
// class Triangle extends PIXI.Graphics {
//   constructor(index = 0) {
//     super();
//     this.index = index;
//     this.ratio = 0;
//     this.hasNewPoints = false;
//     this.makeLinesArrayProperty();
//   }
//   makeLinesArrayProperty() {
//     let line1 = new PIXI.Graphics();
//     let line2 = new PIXI.Graphics();
//     let line3 = new PIXI.Graphics();
//     this.addChild(line1);
//     this.addChild(line2);
//     this.addChild(line3);
//     this.lines = [line1, line2, line3]
//   }
// }
// 
// export default class SierpinkskiAnimation {
//   expandQ = 1.1;
//   expandIncrease = 1.006;
//   ratioIncrease = 0.01;
//   maxRadius = 2000000;
//   constructor(canvas) {
//     this.canvas = canvas;
//     this.startPIXI();
//   }
//   async startPIXI() {
//     const app = new PIXI.Application({
//       background: '#000000',
//       resizeTo: this.canvas,
//     });
//     this.app = app;
//     this.canvas.appendChild(app.view);
//     this.canvasWidth = window.innerWidth;
//     this.canvasHeight = window.innerHeight;
//     let halfWidth = window.innerWidth / 2;
//     let halfHeight = window.innerHeight / 2;
//     let cont = new PIXI.Container();
//     cont.x = halfWidth;
//     cont.y = halfHeight
//     this.cont = cont;
//     app.stage.addChild(cont)
//     window.addEventListener("resize", this.resizeHandler);
//     app.ticker.add(this.ticker);
//     this.init();
//   }
//   ticker = () => {
//     this.cont.rotation += 0.01;
//     this.drawTriangle()
//   }
//   stop() {
//     this.app.destroy(true);
//     window.removeEventListener('resize', this.resize)
//   }
//   init() {
//     this.cont.removeChildren();
//     this.startRadius = window.innerHeight / 4;
//     this.newPointsArray = [];
//     let { point1, point2, point3 } = this.trianglePoints(this.startRadius, { x: 0, y: 0 });
//     this.newGraphic(point1, point2, point3);
//   }
//   resizeHandler = () => {
//     this.canvas.width = this.canvasWidth = window.innerWidth;
//     this.canvas.height = this.canvasHeight = window.innerHeight;
//     let halfWidth = window.innerWidth / 2;
//     let halfHeight = window.innerHeight / 2;
//     this.cont.x = halfWidth;
//     this.cont.y = halfHeight
//   }
//   drawTriangle() {
//     this.startRadius *= this.expandIncrease;
// 
//     if (this.startRadius > this.maxRadius) {
//       this.init();
//     }
//     let points;
//     this.newPointsArray.forEach((item, index) => {
//       if (index === 0) {
// 
//         const { point1, point2, point3 } = this.trianglePoints(this.startRadius, { x: 0, y: 0 })
//         points = [point1, point2, point3]
//       }
//       let temp = this.newPoints(...points, item.graphic)
//       points = temp;
//     })
//   }
//   drawLine(x1, y1, x2, y2, ratio, lines, index) {
//     lines.clear();
//     lines.lineStyle({ width: 1, color: 0xffd900 });
//     lines.moveTo(x1, y1);
//     x2 = x1 + ratio * (x2 - x1);
//     y2 = y1 + ratio * (y2 - y1);
//     lines.lineTo(x2, y2);
// 
//   }
//   draw = (point1, point2, point3, graphic) => {
//     this.drawLine(point1.x, point1.y, point2.x, point2.y, graphic.ratio, graphic.lines[0], graphic.index)
//     this.drawLine(point2.x, point2.y, point3.x, point3.y, graphic.ratio, graphic.lines[1], graphic.index)
//     this.drawLine(point3.x, point3.y, point1.x, point1.y, graphic.ratio, graphic.lines[2], graphic.index)
//     if (graphic.ratio < 1) {
//       graphic.ratio += this.ratioIncrease;
//     } else if (!graphic.hasNewPoints) {
//       graphic.hasNewPoints = true;
//       this.newGraphic(point1, point2, point3);
//     }
//   }
//   newGraphic(point1, point2, point3) {
//     let temp = new Triangle(this.newPointsArray.length);
//     this.newPointsArray.push({ graphic: temp, origPoints: [point1, point2, point3] });
//     this.cont.addChild(temp);
//   }
//   newPoints(point1, point2, point3, graphic) {
//     let newPoint1 = {
//       x: (point1.x + point2.x) / 2,
//       y: (point1.y + point2.y) / 2
//     }
//     let newPoint2 = {
//       x: (point2.x + point3.x) / 2,
//       y: (point2.y + point3.y) / 2
//     }
//     let newPoint3 = {
//       x: (point1.x + point3.x) / 2,
//       y: (point1.y + point3.y) / 2
//     }
//     graphic.clear();
//     graphic.beginFill(0xFFFFFF)
//     graphic.drawCircle(newPoint1.x, newPoint1.y, 2);
//     graphic.drawCircle(newPoint2.x, newPoint2.y, 2);
//     graphic.drawCircle(newPoint3.x, newPoint3.y, 2);
//     graphic.endFill();
//     this.draw(newPoint1, newPoint2, newPoint3, graphic)
//     return [newPoint1, newPoint2, newPoint3]
//   }
//   trianglePoints(radius, centerPoint) {
//     let point1 = { x: radius * Math.cos(0) + centerPoint.x, y: radius * Math.sin(0) + centerPoint.y }
//     let point2 = { x: radius * Math.cos((1 / 3) * (2 * Math.PI)) + centerPoint.x, y: radius * Math.sin((1 / 3) * (2 * Math.PI)) + centerPoint.y }
//     let point3 = { x: radius * Math.cos((2 / 3) * (2 * Math.PI)) + centerPoint.x, y: radius * Math.sin((2 / 3) * (2 * Math.PI)) + centerPoint.y }
//     return { point1, point2, point3 }
//   }
// }
 * ========================================================================= */
