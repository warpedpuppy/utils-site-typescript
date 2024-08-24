import { Point, Polygon, Line, Vector } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class PolygonToPolygonCollision extends AnimationBaseClass {
  static t = "polygon to polygon collision";
  static l = "polygon-to-polygon-ollision";
  title = "polygon to polygon collision";
  star1: Polygon = { vertices: [], draw: () => {}, drag: false };
  star2: Polygon = { vertices: [], draw: () => {}, drag: false };
  mousePoint: Point = { x: 0, y: 0 };
  stars: Polygon[] = [];
  init() {
    this.star1 = this.createStar(
      { x: 200, y: this.halfHeight },
      5,
      50,
      25,
      0,
      this.ctx,
      true,
      "star 1"
    );

    this.star2 = this.createStar(
      { x: this.halfWidth, y: this.halfHeight - 50 },
      5,
      100,
      25,
      0,
      this.ctx,
      false,
      "star 2"
    );
    this.stars.push(this.star1, this.star2);
    this.draw();
  }

  createStar(
    centerPoint: Point,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    angle: number = 0,
    ctx: any,
    rotate: boolean = false,
    id: string = ""
  ): Polygon {
    var rot = (Math.PI / 2) * 3; // start at 270 degrees
    var x = centerPoint.x;
    var y = centerPoint.y;
    let storeCenterPoint = centerPoint;
    var step = Math.PI / spikes; // steps are divided into half the radians
    let star: Polygon = { vertices: [], draw: () => {}, drag: false };
    star.draw = function (
      top: number,
      left: number,
      mousePoint: Point = { x: 0, y: 0 }
    ) {
      ctx.beginPath();

      if (!this.drag) mousePoint = { x: 0, y: 0 };
      centerPoint = this.drag ? { x: 0, y: 0 } : storeCenterPoint;

      this.vertices = [];
      for (let i = 0; i < spikes; i++) {
        x =
          centerPoint.x +
          Math.cos(angle + rot) * outerRadius +
          mousePoint.x -
          left;
        y =
          centerPoint.y +
          Math.sin(angle + rot) * outerRadius +
          mousePoint.y -
          top;

        if (i === 0) {
          ctx.moveTo(x + left, y + top);
        } else {
          ctx.lineTo(x + left, y + top);
        }
        star.vertices.push({ x: x + left, y: y + top });
        rot += step;
        x =
          centerPoint.x +
          Math.cos(angle + rot) * innerRadius +
          mousePoint.x -
          left;
        y =
          centerPoint.y +
          Math.sin(angle + rot) * innerRadius +
          mousePoint.y -
          top;
        star.vertices.push({ x: x + left, y: y + top });
        ctx.lineTo(x + left, y + top);
        rot += step;
      }
      if (rotate) {
        angle += 0.01;
        if (angle > 2 * Math.PI) angle = 0;
      }
      ctx.stroke();
      ctx.closePath();
    };

    return star;
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.keyFunction(this.star1, this.star2)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "yellow";
    }

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "black";

    this.stars.forEach((star) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      star.draw(this.top, this.left, this.mousePoint);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    });

    requestAnimationFrame(this.draw);
  };
  keyFunction(polygon1: Polygon, polygon2: Polygon) {
    // go through each of the vertices, plus the next
    // vertex in the list

    let next = 0;

    for (let current = 0; current < polygon1.vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === polygon1.vertices.length) next = 0;

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = polygon1.vertices[current]; // c for "current"
      let vn = polygon1.vertices[next]; // n for "next"

      // now we can use these two points (a line) to compare
      // to the other polygon's vertices using polyLine()
      let line: Line = { startPoint: vc, endPoint: vn };
      let collision = this.polyLine(polygon2, line);
      if (collision) return true;

      // optional: check if the 2nd polygon is INSIDE the first
      collision = this.polyPoint(polygon1, polygon2.vertices[0]);
      if (collision) return true;
    }

    return false;
  }
  polyLine(polygon: Polygon, line: Line) {
    // go through each of the vertices, plus the next
    // vertex in the list
    let next = 0;
    const { vertices } = polygon;
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position
      // extract X/Y coordinates from each
      let x3 = vertices[current].x;
      let y3 = vertices[current].y;
      let x4 = vertices[next].x;
      let y4 = vertices[next].y;

      let tempLine: Line = {
        startPoint: { x: x3, y: y3 },
        endPoint: { x: x4, y: y4 },
      };
      let hit = this.lineLine(line, tempLine).hit;
      if (hit) {
        return true;
      }
    }

    // never got a hit
    return false;
  }
  lineLine(line1: Line, line2: Line) {
    let uA =
      ((line2.endPoint.x - line2.startPoint.x) *
        (line1.startPoint.y - line2.startPoint.y) -
        (line2.endPoint.y - line2.startPoint.y) *
          (line1.startPoint.x - line2.startPoint.x)) /
      ((line2.endPoint.y - line2.startPoint.y) *
        (line1.endPoint.x - line1.startPoint.x) -
        (line2.endPoint.x - line2.startPoint.x) *
          (line1.endPoint.y - line1.startPoint.y));
    let uB =
      ((line1.endPoint.x - line1.startPoint.x) *
        (line1.startPoint.y - line2.startPoint.y) -
        (line1.endPoint.y - line1.startPoint.y) *
          (line1.startPoint.x - line2.startPoint.x)) /
      ((line2.endPoint.y - line2.startPoint.y) *
        (line1.endPoint.x - line1.startPoint.x) -
        (line2.endPoint.x - line2.startPoint.x) *
          (line1.endPoint.y - line1.startPoint.y));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      // optionally, draw a circle where the lines meet
      let intersectionX =
        line1.startPoint.x + uA * (line1.endPoint.x - line1.startPoint.x);
      let intersectionY =
        line1.startPoint.y + uA * (line1.endPoint.y - line1.startPoint.y);
      return {
        hit: true,
        intersectionX,
        intersectionY,
      };
    }
    return { hit: false };
  }
  polyPoint(polygon: Polygon, point: Point) {
    let collision = false;

    // go through each of the vertices, plus the next
    // vertex in the list
    let next = 0;
    const { vertices } = polygon;
    // console.log(vertices, point);
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = vertices[current]; // c for "current"
      let vn = vertices[next]; // n for "next"

      // compare position, flip 'collision' variable
      // back and forth
      if (
        ((vc.y > point.y && vn.y < point.y) ||
          (vc.y < point.y && vn.y > point.y)) &&
        point.x < ((vn.x - vc.x) * (point.y - vc.y)) / (vn.y - vc.y) + vc.x
      ) {
        collision = !collision;
      }
    }

    return collision;
  }
  pointerDownHandler(e: PointerEvent) {
    if (this.polyPoint(this.star1, this.mousePoint)) {
      this.star1.drag = true;
      this.stars = [this.star2, this.star1];
    }
    if (this.polyPoint(this.star2, this.mousePoint)) {
      this.star2.drag = true;
      this.stars = [this.star1, this.star2];
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.star1.drag = false;
    this.star2.drag = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    this.mousePoint = {
      x: e.pageX - this.left,
      y: e.pageY - this.top,
    };
  }
}
export default PolygonToPolygonCollision;

// ←Collision Detection→

// Refresh your browser for a new random polygon!
// POLYGON/POLYGON
// Our final example in this section checks for the collision of two polygons. Since we really just need to check if any of the sides of one polygon are hitting any of the sides of the other, this is pretty straight-forward! As before, we also test if the one polygon is fully inside the other one.

// Here’s the full example:

// // array of PVectors for each shape
// PVector[] pentagon = new PVector[5];
// PVector[] randomPoly = new PVector[8];

// void setup() {
//   size(600,400);
//   noStroke();

//   // set position of the pentagon's vertices
//   float angle = TWO_PI / pentagon.length;
//   for (int i=0; i<pentagon.length; i++) {
//     float a = angle * i;
//     float x = 300 + cos(a) * 100;
//     float y = 200 + sin(a) * 100;
//     pentagon[i] = new PVector(x,y);
//   }

//   // and create the random polygon
//   float a = 0;
//   int i = 0;
//   while (a < 360) {
//     float x = cos(radians(a)) * random(30,50);
//     float y = sin(radians(a)) * random(30,50);
//     randomPoly[i] = new PVector(x,y);
//     a += random(15, 40);
//     i += 1;
//   }
// }

// void draw() {
//   background(255);

//   // update random polygon to mouse position
//   PVector mouse = new PVector(mouseX, mouseY);
//   PVector diff = PVector.sub(mouse, randomPoly[0]);
//   for (PVector v : randomPoly) {
//     v.add(diff);
//   }

//   // check for collision
//   // if hit, change fill color
//   boolean hit = polyPoly(pentagon, randomPoly);
//   if (hit) fill(255,150,0);
//   else fill(0,150,255);

//   // draw the pentagon
//   noStroke();
//   beginShape();
//   for (PVector v : pentagon) {
//     vertex(v.x, v.y);
//   }
//   endShape();

//   // draw the random polygon
//   fill(0, 150);
//   beginShape();
//   for (PVector v : randomPoly) {
//     vertex(v.x, v.y);
//   }
//   endShape();
// }

// // POLYGON/POLYGON
// boolean polyPoly(PVector[] p1, PVector[] p2) {

//   // go through each of the vertices, plus the next
//   // vertex in the list
//   int next = 0;
//   for (int current=0; current<p1.length; current++) {

//     // get next vertex in list
//     // if we've hit the end, wrap around to 0
//     next = current+1;
//     if (next == p1.length) next = 0;

//     // get the PVectors at our current position
//     // this makes our if statement a little cleaner
//     PVector vc = p1[current];    // c for "current"
//     PVector vn = p1[next];       // n for "next"

//     // now we can use these two points (a line) to compare
//     // to the other polygon's vertices using polyLine()
//     boolean collision = polyLine(p2, vc.x,vc.y,vn.x,vn.y);
//     if (collision) return true;

//     // optional: check if the 2nd polygon is INSIDE the first
//     collision = polyPoint(p1, p2[0].x, p2[0].y);
//     if (collision) return true;
//   }

//   return false;
// }

// // POLYGON/LINE
// boolean polyLine(PVector[] vertices, float x1, float y1, float x2, float y2) {

//   // go through each of the vertices, plus the next
//   // vertex in the list
//   int next = 0;
//   for (int current=0; current<vertices.length; current++) {

//     // get next vertex in list
//     // if we've hit the end, wrap around to 0
//     next = current+1;
//     if (next == vertices.length) next = 0;

//     // get the PVectors at our current position
//     // extract X/Y coordinates from each
//     float x3 = vertices[current].x;
//     float y3 = vertices[current].y;
//     float x4 = vertices[next].x;
//     float y4 = vertices[next].y;

//     // do a Line/Line comparison
//     // if true, return 'true' immediately and
//     // stop testing (faster)
//     boolean hit = lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
//     if (hit) {
//       return true;
//     }
//   }

//   // never got a hit
//   return false;
// }

// // LINE/LINE
// boolean lineLine(float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4) {

//   // calculate the direction of the lines
//   float uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
//   float uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

//   // if uA and uB are between 0-1, lines are colliding
//   if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
//     return true;
//   }
//   return false;
// }

// // POLYGON/POINT
// // used only to check if the second polygon is
// // INSIDE the first
// boolean polyPoint(PVector[] vertices, float px, float py) {
//   boolean collision = false;

//   // go through each of the vertices, plus the next
//   // vertex in the list
//   int next = 0;
//   for (int current=0; current<vertices.length; current++) {

//     // get next vertex in list
//     // if we've hit the end, wrap around to 0
//     next = current+1;
//     if (next == vertices.length) next = 0;

//     // get the PVectors at our current position
//     // this makes our if statement a little cleaner
//     PVector vc = vertices[current];    // c for "current"
//     PVector vn = vertices[next];       // n for "next"

//     // compare position, flip 'collision' variable
//     // back and forth
//     if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
//          (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
//             collision = !collision;
//     }
//   }
//   return collision;
// }
// NEXT: Section 4 Challenges

// [ intro, source, issues ]

// Creative Commons License

// AAAAAAAA
