import { GenericObject, Point } from "../types/types";
const SiteData = {
  trig: {
    circleFromThreePoints: {
      t: "get circle from three points",
      l: "circle-from-three-points",
      bf: function (canvas: HTMLCanvasElement, keyFunction: Function) {
        const obj: GenericObject = {
          text: "",
          points: [],
          init() {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            canvas.addEventListener("pointerdown", this.pointerDownHandler.bind(this))
          },
          pointerDownHandler(e: PointerEvent) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            let { top, left } = this.canvas.getBoundingClientRect();
            if (this.points.length === 3) this.points.shift();
            this.points.push([Math.floor(e.pageX - left), Math.floor(e.pageY - top)])
            this.ctx.font = "12px serif";
            this.ctx.fillText("points:", 10, 30);
            this.ctx.fillText(this.formatText(), 10, 50);

            this.points.forEach((item:Array<Array<Number>>) => {
              this.ctx.beginPath();
              this.ctx.arc(item[0], item[1], 5, 0, 2 * Math.PI);
              this.ctx.stroke();
            })

            if (this.points.length === 3) {
              let { center, radius} = keyFunction(this.points[0][0], this.points[0][1],this.points[1][0], this.points[1][1],this.points[2][0], this.points[2][1]);
              this.ctx.beginPath();
              this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
              this.ctx.stroke();
            }

          },
          formatText() {
            return this.points.map((item:Array<Array<number>>, index: number) => {
              let i = index + 1;
              return `point ${i}: {x:${item[0]}, y:${item[1]}}`
            }).join(",")

          },
          stop() {
            canvas.removeEventListener("pointerdown", this.pointerDownHandler)
          }
          
        }
        return obj;
      },
      f: function (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        var x12 = (x1 - x2);
        var x13 = (x1 - x3);

        var y12 = (y1 - y2);
        var y13 = (y1 - y3);

        var y31 = (y3 - y1);
        var y21 = (y2 - y1);

        var x31 = (x3 - x1);
        var x21 = (x2 - x1);

        //x1^2 - x3^2
        var sx13 = Math.pow(x1, 2) - Math.pow(x3, 2);

        // y1^2 - y3^2
        var sy13 = Math.pow(y1, 2) - Math.pow(y3, 2);

        var sx21 = Math.pow(x2, 2) - Math.pow(x1, 2);
        var sy21 = Math.pow(y2, 2) - Math.pow(y1, 2);

        var f = ((sx13) * (x12)
          + (sy13) * (x12)
          + (sx21) * (x13)
          + (sy21) * (x13))
          / (2 * ((y31) * (x12) - (y21) * (x13)));
        var g = ((sx13) * (y12)
          + (sy13) * (y12)
          + (sx21) * (y13)
          + (sy21) * (y13))
          / (2 * ((x31) * (y12) - (x21) * (y13)));

        var c = -(Math.pow(x1, 2)) -
          Math.pow(y1, 2) - 2 * g * x1 - 2 * f * y1;

        // eqn of circle be 
        // x^2 + y^2 + 2*g*x + 2*f*y + c = 0
        // where centre is (h = -g, k = -f) and radius r
        // as r^2 = h^2 + k^2 - c
        var h = -g;
        var k = -f;
        var sqr_of_r = h * h + k * k - c;

        // r is the radius
        var r = Math.sqrt(sqr_of_r);

        return { radius: r, center: { x: h, y: k } }
      }
    },
    getHalfwayPointofLine: {
      t: "get halfway point in line",
      l: "halfway-point-in-line",
      f: function (start: Point, end: Point) {
        return {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        }
      },
      bf: function (canvas: HTMLCanvasElement) {
        const obj: GenericObject = {
          init() {
            this.canvas = canvas;
            const ctx = canvas.getContext("2d");
            canvas.addEventListener("pointerdown", this.pointerDownHandler)
          },
          pointerDownHandler(e: PointerEvent) {
            console.log(e, "halfway")

          },
          stop() {
            canvas.removeEventListener("pointerdown", this.pointerDownHandler)
          }
        }
        return obj;
      }
    },
    equilateralTriangleVertices: {
      t: "get equilateral triangle vertices from radius and center point",
      l: "equilateral-trianlge-points",
      f: function (radius: number, centerPoint: Point) {
        let point1 = { x: radius * Math.cos(0) + centerPoint.x, y: radius * Math.sin(0) + centerPoint.y }
        let point2 = { x: radius * Math.cos((1 / 3) * (2 * Math.PI)) + centerPoint.x, y: radius * Math.sin((1 / 3) * (2 * Math.PI)) + centerPoint.y }
        let point3 = { x: radius * Math.cos((2 / 3) * (2 * Math.PI)) + centerPoint.x, y: radius * Math.sin((2 / 3) * (2 * Math.PI)) + centerPoint.y }
        return { point1, point2, point3 }
      },
      bf: function (canvas: HTMLCanvasElement) {
        let obj: GenericObject = {
          init() {
            this.canvas = canvas;
            const ctx = canvas.getContext("2d");
            canvas.addEventListener("pointerdown", this.pointerDownHandler)
          },
          pointerDownHandler(e: PointerEvent) {
            console.log(e, "equilateral trianlge")

          },
          stop() {
            canvas.removeEventListener("pointerdown", this.pointerDownHandler)
          }
        }
        return obj;
      }
    }
  }
}

export default SiteData;