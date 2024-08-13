import { GenericObject } from "../../../types/types";
const circleFromThreePoints = {
  t: "get circle from three points",
  l: "circle-from-three-points",
  bf: function (cont: HTMLDivElement, keyFunction: Function) {
    const obj: GenericObject = {
      // text: "",
      points: [],
      text: [],
      ctx: undefined,
      init() {
        this.textDiv = document.getElementById("primary-canvas--content--text");
        this.text.push(
          "<h3>click screen three times to make three points.</h3>"
        );

        this.canvas = document.createElement("canvas");
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.interval = undefined;
        this.circleQ = 0;

        cont.appendChild(this.canvas);

        this.canvas.addEventListener(
          "pointerdown",
          this.pointerDownHandlerThree.bind(this)
        );
        window.addEventListener("resize", this.resizeHandler.bind(this));
        this.draw();
      },
      resizeHandler() {
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.draw();
      },
      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let textString = "";
        this.text.forEach((text: string, i: number) => {
          textString += `${text}`;
        });
        this.textDiv.innerHTML = textString;

        this.points.forEach((item: Array<Array<Number>>) => {
          this.ctx.beginPath();
          this.ctx.arc(item[0], item[1], 5, 0, 2 * Math.PI);
          this.ctx.stroke();
        });

        if (this.points.length === 3) {
          let { center, radius } = keyFunction(
            this.points[0][0],
            this.points[0][1],
            this.points[1][0],
            this.points[1][1],
            this.points[2][0],
            this.points[2][1]
          );

          this.ctx.strokeStyle = "green";
          this.ctx.beginPath();
          this.ctx.arc(center.x, center.y, radius, 0, this.circleQ);
          this.ctx.stroke();
          this.text[3] = `<p>radius: ${Math.floor(
            radius
          )}, center: { x: ${Math.floor(center.x)}, y: ${Math.floor(
            center.y
          )} }</p>`;
          this.interval = setTimeout(this.drawCircle.bind(this), 10);
        }
      },
      drawCircle() {
        let degree = 1 * (Math.PI / 180);
        this.circleQ += degree;
        if (this.circleQ < Math.PI * 2) {
          this.interval = setTimeout(this.drawCircle.bind(this), 10);
          this.draw();
        }
      },
      pointerDownHandlerThree(e: PointerEvent) {
        let { top, left } = this.canvas.getBoundingClientRect();
        if (this.points.length === 3) {
          this.points = [];
          this.circleQ = 0;
          this.text.slice(2);
        }
        this.points.push([
          Math.floor(e.pageX - left),
          Math.floor(e.pageY - top),
        ]);
        this.text[2] = this.formatText();
        this.draw();
      },
      formatText() {
        let str = this.points
          .map((item: Array<Array<number>>, index: number) => {
            let i = index + 1;
            return `point ${i}: { x:${item[0]}, y:${item[1]} }`;
          })
          .join(", ");
        return `<p>${str}</p>`;
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
  f: function (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    let x12 = x1 - x2;
    let x13 = x1 - x3;

    let y12 = y1 - y2;
    let y13 = y1 - y3;

    let y31 = y3 - y1;
    let y21 = y2 - y1;

    let x31 = x3 - x1;
    let x21 = x2 - x1;

    //x1^2 - x3^2
    let sx13 = Math.pow(x1, 2) - Math.pow(x3, 2);

    // y1^2 - y3^2
    let sy13 = Math.pow(y1, 2) - Math.pow(y3, 2);

    let sx21 = Math.pow(x2, 2) - Math.pow(x1, 2);
    let sy21 = Math.pow(y2, 2) - Math.pow(y1, 2);

    let f =
      (sx13 * x12 + sy13 * x12 + sx21 * x13 + sy21 * x13) /
      (2 * (y31 * x12 - y21 * x13));
    let g =
      (sx13 * y12 + sy13 * y12 + sx21 * y13 + sy21 * y13) /
      (2 * (x31 * y12 - x21 * y13));

    let c = -Math.pow(x1, 2) - Math.pow(y1, 2) - 2 * g * x1 - 2 * f * y1;

    // eqn of circle be
    // x^2 + y^2 + 2*g*x + 2*f*y + c = 0
    // where centre is (h = -g, k = -f) and radius r
    // as r^2 = h^2 + k^2 - c
    let h = -g;
    let k = -f;
    let sqr_of_r = h * h + k * k - c;

    // r is the radius
    let r = Math.sqrt(sqr_of_r);

    return { radius: r, center: { x: h, y: k } };
  },
};
export default circleFromThreePoints;
