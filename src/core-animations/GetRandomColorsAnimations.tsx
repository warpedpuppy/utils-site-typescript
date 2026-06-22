import AnimationBaseClass from "./AnimationBaseClass";
import { getRandomColors } from "../pages/createJSON/formulas/usefulLittleThings/GetRandomColors";
import { HSL } from "../types/types";
class GetRandomColorAnimation extends AnimationBaseClass {
  static t = "get random color";
  static l = "get-random-color";
  static f = getRandomColors;
  title = "get random color";
  colorString = "all";
  ballRadius = 50;
  colorArray: HSL[] = [];
  ballDiameter: number = 0;
  totalBalls: number = 0;
  animationObject = getRandomColors;
  storeDimensions = {
    width: this.canvasWidth,
    height: this.canvasHeight,
  };
  ballHQ = 0;
  ballVQ = 0;
  init() {
    this.storeDimensions = {
      width: this.canvasWidth,
      height: this.canvasHeight,
    };
    this.ballDiameter = this.ballRadius * 2;
    this.ballHQ = Math.floor(this.canvasWidth / this.ballDiameter);
    this.ballVQ = Math.floor(this.canvasHeight / this.ballDiameter);
    this.totalBalls = this.ballHQ * this.ballVQ;
    this.createColorArray(this.totalBalls);
    this.draw();
  }
  extraHTML = () => {
    let colors = ["all", "blues", "greens", "yellows", "reds"];
    let buttons = colors.map((color, i) => {
      return (
        <button
          key={`color-button${i}`}
          className="btn-primary"
          onClick={() => this.colorChangeHandler(color)}
        >
          {color}
        </button>
      );
    });

    return <div className="extra-html">{buttons}</div>;
  };
  colorChangeHandler = (str: string) => {
    this.colorString = str;
    this.createColorArray(this.totalBalls);
  };
  createColorArray = (totalBalls: number) => {
    this.colorArray = [];
    for (let i = 0; i < totalBalls; i++) {
      let { H, S, L } = getRandomColors.keyFunction(this.colorString);
      this.colorArray.push({ H, S, L });
    }
  };
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (
      this.canvasHeight !== this.storeDimensions.height ||
      this.canvasWidth !== this.storeDimensions.width
    ) {
      this.ballHQ = Math.floor(this.canvasWidth / this.ballDiameter);
      this.ballVQ = Math.floor(this.canvasHeight / this.ballDiameter);
      this.totalBalls = this.ballHQ * this.ballVQ;
      this.createColorArray(this.totalBalls);
      this.storeDimensions = {
        width: this.canvasWidth,
        height: this.canvasHeight,
      };
    }
    this.ballHQ = Math.floor(this.canvasWidth / this.ballDiameter);
    this.ballVQ = Math.floor(this.canvasHeight / this.ballDiameter);
    let gridWidth = this.ballHQ * this.ballDiameter;
    let gridHeight = this.ballVQ * this.ballDiameter;
    let leftOffset = (this.canvasWidth - gridWidth) / 2;
    let topOffset = (this.canvasHeight - gridHeight) / 2;
    let counter = 0;

    for (let i = 0; i < this.ballVQ; i++) {
      for (let j = 0; j < this.ballHQ; j++) {
        let { H, S, L } = this.colorArray[counter];
        let x = leftOffset + this.ballRadius + this.ballDiameter * j;
        let y = topOffset + this.ballRadius + this.ballDiameter * i;
        const gr = this.ctx.createRadialGradient(
          x - this.ballRadius * 0.32, y - this.ballRadius * 0.32, 0,
          x, y, this.ballRadius
        );
        gr.addColorStop(0,    `hsl(${H} ${S}% ${Math.min(95, L + 25)}%)`);
        gr.addColorStop(0.55, `hsl(${H} ${S}% ${L}%)`);
        gr.addColorStop(1,    `hsl(${H} ${S}% ${Math.max(5, L - 25)}%)`);
        this.ctx.fillStyle = gr;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.ballRadius, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
        counter++;
      }
    }

    this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default GetRandomColorAnimation;
