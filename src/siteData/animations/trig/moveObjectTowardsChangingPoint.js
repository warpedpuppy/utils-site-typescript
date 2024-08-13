import { GenericObject, Point} from "../../../types/types";
const moveObjectToChangingPoint = {
  t: "move object to changing point",
  l: "move-to-changing-point",
  f: function (destinationPoint: Point, zeroReference: Point) {

    return Math.atan2(
      destinationPoint.y - zeroReference.y,
      destinationPoint.x - zeroReference.x
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
        this.textDiv = document.getElementById("primary-canvas--content--text");
        this.text.push("<h3>click screen to make three points.</h3>");

        // this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvasWidth = cont.clientWidth;
        this.canvas.height = this.canvasHeight = cont.clientHeight;
        this.halfHeight = this.canvasHeight / 2;
        this.halfWidth = this.canvasWidth / 2;
        this.ctx = this.canvas.getContext("2d");
        this.interval = undefined;
        this.circleQ = 0;

        cont.appendChild(this.canvas);

        window.addEventListener("resize", this.resizeHandler.bind(this));

        this.dot = {
          x: Math.floor(Math.random() * this.canvasWidth),
          y: Math.floor(Math.random() * this.canvasHeight),
        };

        this.img = new Image();

        this.draw = this.draw.bind(this);
        this.img.addEventListener("load", () => {
          this.ctx.drawImage(this.img, 0, 0);
          this.draw();
        });

        this.img.src = "/bmps/arrow.png";
        this.vx = 1;
        this.vy = 1;
        this.x = 0;
        this.y = 0;
        this.ratio = 0;

        this.interval = setInterval(this.drawDot.bind(this), 2000);
      },
      drawDot() {
        this.ratio = 0;
        this.dot = {
          x: Math.floor(Math.random() * this.canvasWidth),
          y: Math.floor(Math.random() * this.canvasHeight),
        };
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

        let angle = keyFunction(this.dot, {x: this.halfWidth, y: this.halfHeight})

        this.ctx.translate(this.halfWidth, this.halfHeight);
        this.ctx.rotate(angle);
        this.ctx.translate(-this.halfWidth, -this.halfHeight);

        this.ctx.drawImage(this.img, this.halfWidth - 50, this.halfHeight - 25);
        this.ctx.resetTransform();

        // this.x = destinationPoint.x;
        // this.y = destinationPoint.y;
        this.ctx.beginPath();
        this.ctx.arc(this.dot.x, this.dot.y, 5, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.halfHeight);
        this.ctx.lineTo(this.canvasWidth, this.halfHeight);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.halfWidth, 0);
        this.ctx.lineTo(this.halfWidth, this.canvasHeight);
        this.ctx.stroke();

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.halfWidth, this.halfHeight);
        // this.ctx.lineTo(this.dot.x, this.dot.y);
        // this.ctx.stroke();

        requestAnimationFrame(this.draw);
      },
      stop() {
        clearInterval(this.interval);
        this.textDiv.innerHTML = "";
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
export default moveObjectToChangingPoint;
