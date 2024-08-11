import { GenericObject, Point } from "../../types/types";
const  getHalfwayPointofLine = {
  t: "get halfway point in line",
  l: "halfway-point-in-line",
  f: function (start: Point, end: Point) {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    }
  },
  bf: function (cont: HTMLDivElement, keyFunction: Function) {
    const obj: GenericObject = {
      init() {
        this.canvas = document.createElement("canvas");
        cont.appendChild(this.canvas);
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.ctx = this.canvas.getContext("2d");

        this.startPoint = undefined;
        this.endPoint = undefined;
        let { top, left } = this.canvas.getBoundingClientRect();
        this.top = top;
        this.left = left;
        this.allowDraw = false;
        this.canvas.addEventListener("pointerdown", this.pointerDownHandler.bind(this));
        this.canvas.addEventListener("pointermove", this.pointerMoveHandler.bind(this));
        this.canvas.addEventListener("pointerup", this.pointerUpHandler.bind(this));
        window.addEventListener("resize", this.resizeHandler.bind(this))
      },
      resizeHandler() {
        console.log("resize")
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.draw();
      },
      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.font = "12px serif";
        this.ctx.fillText("click and drag to form a line", 10, 50);
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke();

        let point: Point = keyFunction(this.startPoint,this.endPoint)

        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
      },
      pointerDownHandler(e: PointerEvent) {
        this.startPoint = {x: Math.floor(e.pageX - this.left), y: Math.floor(e.pageY - this.top)};
        this.allowDraw = true;
      },
      pointerMoveHandler(e: PointerEvent) {
        if (this.allowDraw) {
          this.endPoint = {x: Math.floor(e.pageX - this.left), y: Math.floor(e.pageY - this.top)}
          this.draw();
        }
      },
      pointerUpHandler(e: PointerEvent) {
        this.allowDraw = false;
      },
      stop() {
        this.canvas.removeEventListener("pointerdown", this.pointerDownHandler.bind(this));
        this.canvas.removeEventListener("pointermove", this.pointerMoveHandler.bind(this));
        this.canvas.removeEventListener("pointerup", this.pointerUpHandler.bind(this));
        window.removeEventListener("resize", this.resizeHandler.bind(this))
        cont.removeChild(this.canvas);
        this.canvas = null;
      }
    }
    return obj;
  }
}
export default getHalfwayPointofLine;