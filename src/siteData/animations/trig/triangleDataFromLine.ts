import { Point, GenericObject } from "../../../types/types";
const triangleDataFromLine = {
  t: "get triangle data from line",
  l: "get-triangle-data-from-line",
  f: function (startPoint: Point, endPoint: Point) {
    let hypotenuse = distanceBetweenPoints(startPoint, endPoint);
    let adjacent = distanceBetweenPoints(startPoint, {
      x: endPoint.x,
      y: startPoint.y,
    });
    let opposite = distanceBetweenPoints(
      {
        x: endPoint.x,
        y: startPoint.y,
      },
      endPoint
    );

    let oh = opposite / hypotenuse;
    let angle1 = Math.asin(oh); // could have used acos or atan -- we have the data
    let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
    let remainingAngle = 180 - angleInDegrees - 90;

    return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };

    function distanceBetweenPoints(startPoint: Point, endPoint: Point) {
      let a = startPoint.x - endPoint.x;
      let b = startPoint.y - endPoint.y;
      return Math.sqrt(a * a + b * b);
    }
  },
  bf: function (cont: HTMLDivElement, keyFunction: Function) {
    const obj: GenericObject = {
      init() {
        this.canvas = document.createElement("canvas");
        this.textDiv = document.getElementById("primary-canvas--content--text");
        this.textDiv.innerHTML = `<h3>click and drag to draw line and get data.</h3>`;
        cont.appendChild(this.canvas);
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "bold 14px sans serif";
        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: 0, y: 0 };
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
        this.ctx.fillText("A", this.startPoint.x, this.startPoint.y);

        this.ctx.strokeStyle = "grey";
        this.ctx.lineWidth = 0.25;
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
        this.ctx.stroke();
        this.ctx.fillText("C", this.endPoint.x, this.startPoint.y);

        this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke();
        this.ctx.fillText("B", this.endPoint.x, this.endPoint.y);

        let radius = this.distanceBetweenPoints(this.startPoint, this.endPoint);

        let { angleInDegrees, remainingAngle, hypotenuse, opposite, adjacent } =
          keyFunction(this.startPoint, this.endPoint);
        this.textDiv.innerHTML = `
        <h3>click and drag to draw line and get data.</h3>
        <h3>the hypotenuse  is ${Math.floor(hypotenuse)} pixels long.</h3>
        <h3>the adjacent  is ${Math.floor(adjacent)} pixels long.</h3>
        <h3>the opposite  is ${Math.floor(opposite)} pixels long.</h3>
        <h3>Angle "A" is ${Math.floor(angleInDegrees)} degrees.</h3>
        <h3>Angle "B" is ${Math.floor(remainingAngle)} degrees.</h3>
        <h3>Angle "C" is 90 degrees.</h3>
        `;

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
export default triangleDataFromLine;
