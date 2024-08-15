import { Nullable, Point } from "../../../types/types";

class DistributePointsAroundACircle {
  static t: string = "distribute around circle";
  static l: string = "distribute-around-circle";
  title: string = "distribute around circle";
  canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  halfHeight: number = 0;
  halfWidth: number = 0;
  totalItems: number = 0;
  cont: HTMLDivElement = undefined!;
  ctx = this.canvas?.getContext("2d");
  keyFunction(circleCenter: Point, radius: number, totalItems: number) {
    let totalCircleRadians = Math.PI * 2;
    let returnArray = [];
    for (let i: number = 0; i < totalItems; i++) {
      let percent = i / totalItems;
      const x =
        circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
      const y =
        circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
      returnArray.push({ x, y });
    }
    return returnArray;
  }
  init(cont: HTMLDivElement) {
    this.cont = cont;
    if (!this.canvas) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.ctx = this.canvas.getContext("2d");
    cont.innerHTML = "";
    this.cont.appendChild(this.canvas);
    this.draw();
    this.totalItems = 20;
    window.addEventListener("resize", this.resizeHandler);
  }
  extraHTML = () => {
    let options = [];
    for (let i = 5; i <= 100; i += 5) {
      options.push(
        <option value={i} key={`extra-html-options-${i}`}>
          {i}
        </option>
      );
    }
    return (
      <div className="extra-html">
        <label>change item quantity: </label>
        <select
          onChange={(e) => this.totalItemsChangeHandler(e.currentTarget.value)}
          defaultValue={this.totalItems}
        >
          {options}
        </select>
      </div>
    );
  };
  totalItemsChangeHandler(num: string) {
    this.totalItems = Number(num);
  }
  resizeHandler = () => {
    if (!this.canvas) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
  };
  cosWave(startValue: number, differential: number, speed: number) {
    const currentDate = new Date();
    return startValue + Math.cos(currentDate.getTime() * speed) * differential;
  }
  draw = () => {
    if (!this.canvas || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas?.height);

    let radius = this.cosWave(100, 100, 0.001);

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfHeight);
    this.ctx.lineTo(this.canvasWidth, this.halfHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth, 0);
    this.ctx.lineTo(this.halfWidth, this.canvasHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.halfWidth, this.halfHeight, radius, 0, 2 * Math.PI);
    this.ctx.stroke();

    let points = this.keyFunction(
      { x: this.halfWidth, y: this.halfHeight },
      radius,
      this.totalItems
    );

    points.forEach((point: Point) => {
      if (!this.ctx) return;
      this.ctx.strokeStyle = "rgba(0 0 0 / 0.5)";
      this.ctx.lineWidth = 2;

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);

      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.halfWidth, this.halfHeight);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    });
    requestAnimationFrame(this.draw);
  };
  stop() {
    if (!this.ctx || !this.canvas) return;
    this.cont.innerHTML = "";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    window.removeEventListener("resize", this.resizeHandler.bind(this));
    // this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default DistributePointsAroundACircle;
