import { Point, GenericObject } from "../../../types/types";
const equilateralTriangleVertices = {
  t: "get triangle data",
  l: "get-triangle-data",
  f: function (hypotenuse: number, adjacent: number, opposite: number) {
    let oa = opposite / adjacent;
    let angle1 = Math.asin(oa);
    let angleInDegrees = angle1 * (180 / Math.PI);

    let radians = Math.sin(angle1);

    console.log("asins:", oa, angle1, angleInDegrees);
    console.log("sins:", oa, radians);

    // let ah = adjacent / hypotenuse;
    // angle1 = Math.acos(ah);
    // angleInDegrees = angle1 * (180 / Math.PI);
    // console.log("acos:", ah, angle1, angleInDegrees);
  },
  bf: function (cont: HTMLDivElement, keyFunction: Function) {
    const obj: GenericObject = {
      init() {
        this.canvas = document.createElement("canvas");
        this.textDiv = document.getElementById("primary-canvas--content--text");

        cont.appendChild(this.canvas);
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "bold 14px sans serif";
        this.startPoint = undefined;
        this.endPoint = undefined;
        let { top, left } = this.canvas.getBoundingClientRect();
        this.top = top;
        this.left = left;
        this.allowDraw = false;
        this.canvas.addEventListener(
          "pointerdown",
          this.pointerDownHandler.bind(this)
        );
        this.canvas.addEventListener(
          "pointermove",
          this.pointerMoveHandler.bind(this)
        );
        this.canvas.addEventListener(
          "pointerup",
          this.pointerUpHandler.bind(this)
        );
        window.addEventListener("resize", this.resizeHandler.bind(this));
      },
      resizeHandler() {
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.draw();
      },
      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke();
        this.ctx.fillText(
          `{x:${this.startPoint.x},y:${this.startPoint.y}}`,
          this.startPoint.x,
          this.startPoint.y
        );

        let hypotenuse = this.distanceBetweenPoints(
          this.startPoint,
          this.endPoint
        );

        this.ctx.strokeStyle = "grey";
        this.ctx.lineWidth = 0.25;
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
        this.ctx.stroke();
        this.ctx.fillText(
          `{x:${this.endPoint.x},y:${this.startPoint.y}}`,
          this.endPoint.x,
          this.startPoint.y
        );
        let adjacent = this.distanceBetweenPoints(this.startPoint, {
          x: this.endPoint.x,
          y: this.startPoint.y,
        });

        this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke();
        this.ctx.fillText(
          `{x:${this.endPoint.x},y:${this.endPoint.y}}`,
          this.endPoint.x,
          this.endPoint.y
        );
        let opposite = this.distanceBetweenPoints(
          {
            x: this.endPoint.x,
            y: this.startPoint.y,
          },
          this.endPoint
        );

        let radius = this.distanceBetweenPoints(this.startPoint, this.endPoint);
        this.textDiv.innerHTML = `
        <h3>the hypotenuse  is ${Math.floor(hypotenuse)} pixels long.</h3>
        <h3>the adjacent  is ${Math.floor(adjacent)} pixels long.</h3>
        <h3>the opposite  is ${Math.floor(opposite)} pixels long.</h3>`;

        keyFunction(hypotenuse, adjacent, opposite);
        this.ctx.beginPath();
        this.ctx.arc(
          this.startPoint.x,
          this.startPoint.y,
          radius,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
      },
      distanceBetweenPoints(startPoint: Point, endPoint: Point) {
        let a = startPoint.x - endPoint.x;
        let b = startPoint.y - endPoint.y;
        return Math.sqrt(a * a + b * b);
      },
      pointerDownHandler(e: PointerEvent) {
        this.startPoint = {
          x: Math.floor(e.pageX - this.left),
          y: Math.floor(e.pageY - this.top),
        };
        this.allowDraw = true;
      },
      pointerMoveHandler(e: PointerEvent) {
        if (this.allowDraw) {
          this.endPoint = {
            x: Math.floor(e.pageX - this.left),
            y: Math.floor(e.pageY - this.top),
          };
          this.draw();
        }
      },
      pointerUpHandler(e: PointerEvent) {
        this.allowDraw = false;
      },
      stop() {
        this.textDiv.innerHTML = "";
        this.canvas.removeEventListener(
          "pointerdown",
          this.pointerDownHandler.bind(this)
        );
        this.canvas.removeEventListener(
          "pointermove",
          this.pointerMoveHandler.bind(this)
        );
        this.canvas.removeEventListener(
          "pointerup",
          this.pointerUpHandler.bind(this)
        );
        window.removeEventListener("resize", this.resizeHandler.bind(this));
        cont.removeChild(this.canvas);
        this.canvas = null;
      },
    };
    return obj;
  },
};
export default equilateralTriangleVertices;
