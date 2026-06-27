import AnimationBaseClass from "./AnimationBaseClass";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import { radToDeg } from "@utilspalooza/core/RadToDeg";
import { unitCirclePoint as unitCirclePointFormula } from "../pages/createJSON/formulas/animation/UnitCirclePoint";

function drawDeMystifySineCosine(
  ctx: any,
  canvasWidth: any,
  canvasHeight: any,
  textDiv: HTMLElement | null
): void {
  const now = performance.now() * 0.001;
  const progress = (Math.sin(now) + 1) / 2;
  const angle = progress * (Math.PI / 2);
  const radius = Math.min(canvasWidth * 0.22, canvasHeight * 0.28, 130);
  const centerX = canvasWidth * 0.28;
  const centerY = canvasHeight * 0.62;
  const point = unitCirclePoint(centerX, centerY, radius, -angle);
  const adjacent = point.x - centerX;
  const opposite = centerY - point.y;
  const degrees = radToDeg(angle);
  const ratioPanelX = canvasWidth * 0.58;
  const ratioPanelWidth = canvasWidth * 0.28;
  const ratioScale = ratioPanelWidth / radius;
  const adjacentBarWidth = adjacent * ratioScale;
  const oppositeBarWidth = opposite * ratioScale;

  ctx.font = "bold 18px Arial";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - radius - 28, centerY);
  ctx.lineTo(centerX + radius + 28, centerY);
  ctx.moveTo(centerX, centerY + 28);
  ctx.lineTo(centerX, centerY - radius - 28);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x, centerY);
  ctx.stroke();

  ctx.strokeStyle = "#7de8ff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  ctx.strokeStyle = "#86efac";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(point.x, centerY);
  ctx.stroke();

  ctx.strokeStyle = "#ff7a00";
  ctx.beginPath();
  ctx.moveTo(point.x, centerY);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(125,232,255,0.65)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 28, -angle, 0);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Arial";
  ctx.fillText(`${degrees.toFixed(0)}deg`, centerX + 18, centerY - 10);
  ctx.font = "14px Arial";
  ctx.fillStyle = "#86efac";
  ctx.fillText("adjacent", centerX + adjacent / 2 - 24, centerY + 22);
  ctx.fillStyle = "#ff7a00";
  ctx.fillText("opposite", point.x + 10, centerY - opposite / 2);
  ctx.fillStyle = "#7de8ff";
  ctx.fillText("hypotenuse", centerX + adjacent / 2 - 30, centerY - opposite / 2 - 10);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "bold 16px Arial";
  ctx.fillText("cos(theta) = adjacent / hypotenuse", ratioPanelX, centerY - 78);
  ctx.fillText("sin(theta) = opposite / hypotenuse", ratioPanelX, centerY + 8);

  ctx.fillStyle = "#86efac";
  ctx.fillRect(ratioPanelX, centerY - 58, adjacentBarWidth, 12);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.strokeRect(ratioPanelX, centerY - 58, radius * ratioScale, 12);

  ctx.fillStyle = "#ff7a00";
  ctx.fillRect(ratioPanelX, centerY + 28, oppositeBarWidth, 12);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.strokeRect(ratioPanelX, centerY + 28, radius * ratioScale, 12);

  ctx.fillStyle = "#86efac";
  ctx.fillText(
    `${adjacent.toFixed(1)} / ${radius.toFixed(1)} = ${(adjacent / radius).toFixed(3)}`,
    ratioPanelX,
    centerY - 22
  );
  ctx.fillStyle = "#ff7a00";
  ctx.fillText(
    `${opposite.toFixed(1)} / ${radius.toFixed(1)} = ${(opposite / radius).toFixed(3)}`,
    ratioPanelX,
    centerY + 64
  );

  if (textDiv) {
    textDiv.innerHTML = `
      <p>As the triangle swings through the top-right quarter of the circle, the horizontal leg is the <strong>adjacent</strong> side and the vertical leg is the <strong>opposite</strong> side.</p>
      <p><strong>cos(theta)</strong> tells you how much of the radius survives horizontally. <strong>sin(theta)</strong> tells you how much of the radius survives vertically.</p>
      <p>When the point nears the right edge, cosine is close to 1 and sine is close to 0. As the point climbs upward, cosine shrinks and sine grows.</p>
    `;
  }
}

export { drawDeMystifySineCosine };

export default class DeMystifySineCosine extends AnimationBaseClass {
  static t: string = "demystify sine and cosine";
  static l: string = "demystify-sine-and-cosine";
  static f = unitCirclePointFormula;
  title = "demystify sine and cosine";
  animationObject = unitCirclePointFormula;
  i: number = 0;
  startValue = 0;
  differential = 200;
  speed = 0.005;
  thinLine = 2;
  fatLine = 5;

  init() {
    this.draw();
  }

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawDeMystifySineCosine(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.textDiv
    );
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
