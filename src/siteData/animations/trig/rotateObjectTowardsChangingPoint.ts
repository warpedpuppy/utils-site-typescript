import { GenericObject, Point } from "../../../types/types";
const rotateObjectTowardsChangingPoint = {
  t: "rotate object to changing point",
  l: "rotate-to-changing-point",
  f: function (originPoint: Point, destinationPoint: Point) {
    return Math.atan2(
      destinationPoint.y - originPoint.y,
      destinationPoint.x - originPoint.x
    );
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

        window.addEventListener("resize", this.resizeHandler.bind(this));

        this.draw = this.draw.bind(this);

        this.img = new Image();
        this.img.addEventListener("load", () => {
          this.ctx.drawImage(this.img, 0, 0);
          this.draw();
        });
        this.img.src = "/bmps/arrow.png";

        // this.vx = 1;
        // this.vy = 1;
        // this.x = 0;
        // this.y = 0;
        // this.ratio = 0;
        this.i = 0;
      },
      pointsAroundCircle(
        circleCenter: Point,
        i: number,
        radius: number,
        numElements: number
      ) {
        const x =
          circleCenter.x + radius * Math.cos(2 * Math.PI * (i / numElements));
        const y =
          circleCenter.y + radius * Math.sin(2 * Math.PI * (i / numElements));
        return { x, y };
      },
      resizeHandler() {
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.draw();
      },
      draw() {
        this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);

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

        this.ctx.strokeStyle = "grey";
        this.ctx.lineWidth = 2;

        let point = this.pointsAroundCircle(
          { x: this.halfWidth, y: this.halfHeight },
          this.i,
          200,
          360
        );

        this.i += 0.5;
        if (this.i > 360) this.i = 0;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
        this.ctx.stroke();

        let angle = keyFunction(
          {
            x: this.halfWidth,
            y: this.halfHeight,
          },
          point
        );

        this.ctx.translate(this.halfWidth, this.halfHeight);
        this.ctx.rotate(angle);
        this.ctx.translate(-this.halfWidth, -this.halfHeight);

        this.ctx.drawImage(this.img, this.halfWidth - 50, this.halfHeight - 25);
        this.ctx.resetTransform();

        requestAnimationFrame(this.draw);
      },
      stop() {
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
export default rotateObjectTowardsChangingPoint;
