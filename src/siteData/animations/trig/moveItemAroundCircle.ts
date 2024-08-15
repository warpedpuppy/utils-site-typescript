import { GenericObject, Point } from "../../../types/types";
const moveItemAroundCircle = {
  t: "move item around circle",
  l: "move-item-around-circle",
  f: function (
    circleCenter: Point,
    radius: number,
    percentageAroundCircle: number
  ) {
    let totalCircleRadians = Math.PI * 2;
    let percent = percentageAroundCircle / 100;
    const x = circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
    const y = circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
    return { x, y };
  },
  bf: function (cont: HTMLDivElement, keyFunction: Function) {
    const obj: GenericObject = {
      // text: "",
      points: [],
      text: [],
      ctx: undefined,
      canvas: document.createElement("canvas"),
      init() {
        this.canvas.width = this.canvasWidth = cont.clientWidth;
        this.canvas.height = this.canvasHeight = cont.clientHeight;
        this.halfHeight = this.canvasHeight / 2;
        this.halfWidth = this.canvasWidth / 2;
        this.ctx = this.canvas.getContext("2d");

        cont.appendChild(this.canvas);
        this.draw = this.draw.bind(this);
        this.draw();
        this.i = 0;
        window.addEventListener("resize", this.resizeHandler.bind(this));
      },

      resizeHandler() {
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.draw();
      },

      draw() {
        this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.halfHeight);
        this.ctx.lineTo(this.canvasWidth, this.halfHeight);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.halfWidth, 0);
        this.ctx.lineTo(this.halfWidth, this.canvasHeight);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.halfWidth, this.halfHeight, 200, 0, 2 * Math.PI);
        this.ctx.stroke();

        let point = keyFunction(
          { x: this.halfWidth, y: this.halfHeight },
          200,
          this.i
        );
        this.i += 0.5;
        if (this.i > 100) this.i = 0;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgba(0 0 0 / 0.25)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.halfWidth, this.halfHeight);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.x, this.halfHeight);
        this.ctx.stroke();

        requestAnimationFrame(this.draw);
      },
      stop() {
        clearInterval(this.interval);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.removeEventListener(
          "pointerdown",
          this.pointerDownHandlerThree
        );
        window.removeEventListener("resize", this.resizeHandler.bind(this));
        cont.removeChild(this.canvas);
        this.canvas = null;
      },
    };
    return obj;
  },
};
export default moveItemAroundCircle;
