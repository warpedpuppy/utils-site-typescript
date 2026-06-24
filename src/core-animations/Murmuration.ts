import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

/*
 * Murmuration (flocking starlings) — ported from the warpedpuppies portfolio "pretty little things".
 *
 * STATUS: SCAFFOLD. drawMurmuration() below is intentionally BLANK — Ted ports it.
 * Original tech: Canvas 2D (already 2D in the portfolio — lightest port)
 *
 * NOTES: Already Canvas 2D. Flatten the 3 classes below into drawMurmuration(); replace the setInterval that moves the destination points with frame-based timing (no hidden clock). Extractable pure math worth lifting to @utilspalooza/core later: a flockStep / boids steering function over Point/Vec2.
 *
 * The complete original source is at the BOTTOM of this file, commented out,
 * as the reference to port from. When drawMurmuration() is implemented, delete the
 * placeholder() call in init() so the real animation runs.
 */

const ELI5 = `TODO (Ted): write the ELI5 explainer for Murmuration (flocking starlings).`;

/**
 * drawMurmuration — self-contained Canvas 2D draw routine.
 * (The CodePen pens embed this via .toString(), so keep it dependency-free:
 *  no module-level imports referenced inside the body.)
 *
 * TODO (Ted): port the commented original source at the bottom of this file
 * into here. Blank for now.
 */
export function drawMurmuration(
  _ctx: CanvasRenderingContext2D,
  _width: number,
  _height: number
): void {
  // TODO: port me. See the commented original source at the bottom of this file.
}

const MurmurationFormula: CollisionDetectionObject = {
  keyFunction: drawMurmuration,
  dependencies: [],
  functionString: `// TODO (Ted): port drawMurmuration() — see Murmuration.ts`,
};

class Murmuration extends Template {
  static t = "Murmuration (flocking starlings)";
  static l = "murmuration";
  static f = MurmurationFormula;
  title = "Murmuration (flocking starlings)";

  animationObject = MurmurationFormula;
  animId = 0;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    // TODO (Ted): once drawMurmuration() is implemented, start the rAF loop here
    // (e.g. this.animate()) and remove the placeholder() call below.
    this.placeholder();
  }

  /** Temporary stand-in until drawMurmuration() is ported. Safe to delete then. */
  placeholder() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = "#888";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Murmuration (flocking starlings) — port in progress", this.halfWidth, this.halfHeight);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#555";
    ctx.fillText(
      "scaffold: original source is commented in Murmuration.ts",
      this.halfWidth,
      this.halfHeight + 24
    );
  }

  stop() {
    cancelAnimationFrame(this.animId);
    super.stop();
  }
}

export default Murmuration;

/* ===========================================================================
 * ORIGINAL PORTFOLIO SOURCE — reference for the Canvas 2D port. NOT executed.
 * Tech: Canvas 2D (already 2D in the portfolio — lightest port)
 * From: ~/Sites/warpedpuppies/portfolio/src/components/pretty-little-things/
 * ===========================================================================
// ── murmuration/code/index.js ─────────────────────────────────────────────
// import Murmuration from "./Murmuration.js";
// 
// export default class SetUpMurmuration {
// 
// 	constructor (canvas) {
// 		this.canvas = canvas;
// 		this.engine = canvas.getContext("2d");
// 		this.canvasWidth = window.innerWidth;
// 		this.canvasHeight = window.innerHeight;
// 		this.halt = false;
// 		this.canvas.setAttribute("width", this.canvasWidth);
// 		this.canvas.setAttribute("height", this.canvasHeight);
// 	
// 		const birdQuantity = 500;
// 		this.murmuration = new Murmuration(this.engine, this.canvasWidth, this.canvasHeight, birdQuantity);
// 		this.tick = this.tick.bind(this);
// 		this.tick();
// 
// 		window.addEventListener("resize", this.resizeHandler);
// 	}
// 
// 	start() {
// 
// 	}
// 	stop() {
// 		this.halt = true;
// 		window.removeEventListener("resize", this.resizeHandler);
// 	}
// 
// 	tick () {
// 		if (this.halt) return ;
// 		this.engine.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
// 		this.murmuration.renderBirds();
// 		window.requestAnimationFrame(this.tick);
// 	};
// 
// 	resizeHandler = (e) => {
// 		this.canvasWidth = window.innerWidth;
// 		this.canvasHeight = window.innerHeight;
// 		this.murmuration.resize(this.canvasWidth, this.canvasHeight)
// 		this.canvas.setAttribute("width", this.canvasWidth);
// 		this.canvas.setAttribute("height", this.canvasHeight);
// 	}
// 	
// 
// 	
// 
// }
//
// ── murmuration/code/Murmuration.js ───────────────────────────────────────
// import Starling from "./Starlings.js";
// 
// export default class Murmuration {
//   birdQ;
//   birds = [];
//   frame = 0;
//   speed = 1.4;
//   destinationPoints = { x: 0.5, y: 0.5, z: 0.5 };
//   birdLineCount = 5;
//   birdLineIndex = -1;
//   z = { current: 1, target: 1 };
// 
//   constructor(engine, canvasWidth, canvasHeight, birdQuantity) {
// 	this.birdQ = birdQuantity;
//     this.engine = engine;
//     this.canvasWidth = canvasWidth;
//     this.canvasHeight = canvasHeight;
//     this.registerDestinationPoints();
//     this.createBirds(this.birdLineCount);
//   }
// 
//   resize(canvasWidth, canvasHeight) {
//     this.canvasWidth = canvasWidth;
//     this.canvasHeight = canvasHeight;
//   }
// 
//   registerDestinationPoints() {
//     setInterval(() => {
//       this.destinationPoints.x = Math.random();
//       this.destinationPoints.y = Math.random();
//       this.z.target = 0.5 + Math.random();
//     }, 1000);
//   }
// 
//   createBirds(birdLineCount) {
//     for (let i = 0; i < this.birdQ; i++) {
//       let b = new Starling(this.engine, this.canvasWidth, this.canvasHeight);
//       this.birds.push(b);
//     }
//   }
// 
//   renderBirds() {
//     this.frame++;
//     this.alterZ();
// 
//     //change math
//     this.birds.forEach((bird) => {
//       bird.solveBirdMove(this.frame, this.speed, this.destinationPoints);
//     });
// 
//     //draw new birds
//     this.birds.forEach((bird) => {
//       bird.drawBird(this.engine, this.canvasWidth, this.canvasHeight, this.z);
//     });
//   }
// 
//   alterZ() {
//     this.z.current += (this.z.target - this.z.current) / 100;
//   }
// 
//   animate() {
//     this.frame++;
//     this.z.current += (this.z.target - this.z.current) / 100;
//     this.renderBirds();
//   }
// }
//
// ── murmuration/code/Starlings.js ─────────────────────────────────────────
// export default class Starling {
//   wing = Math.random();
//   wingAdd = Math.random();
//   speed = (0.2 + Math.random() * 0.8) / 2000;
//   pos = {
//     x: 0.25 + Math.random() * 0.5,
//     y: 0.25 + Math.random() * 0.5,
//     z: Math.random(),
//   };
//   move = {
//     x: (0.5 - Math.random()) / 100,
//     y: (0.5 - Math.random()) / 100,
//     z: 0,
//   };
//   ownMove = {
//     t: (20 + Math.random() * 100) | 0,
//     x: 0,
//     y: 0,
//   };
//   bodyHeight = 2;
//   bodyWidth = 40;
//   wingHeight = 20;
//   wingFlapSpeed = (Math.random() * 0.025) + 0.0275;
//   speedLimit = 0.003;
//   
// 
//   constructor(engine, canvasWidth, canvasHeight) {
// 	this.engine = engine;
// 	this.canvasWidth = canvasWidth;
// 	this.canvasHeight = canvasHeight;
//   }
// 
//   enforceSpeedLimit () {
// 	  if (Math.abs(this.move.x) > this.speedLimit) {
// 		this.move.x *= 0.99;
// 	  }
// 	  if (Math.abs(this.move.y) > this.speedLimit) {
// 		this.move.y *= 0.99;
// 	  }
// 	  if (Math.abs(this.move.z) > this.speedLimit) {
// 		this.move.z *= 0.99;
// 	  }
//   }
// 
//   preventClumping (frame) {
// 	if (frame % this.ownMove.t === 0) {
// 		this.ownMove.x = (0.5 - Math.random()) / 3;
// 		this.ownMove.y = (0.5 - Math.random()) / 3;
// 	  }
//   }
// 
//   solveBirdMove(frame, speed, destinationPoints) {
//    
// 	this.enforceSpeedLimit();
// 	this.preventClumping(frame);
// 
//     this.move.x += speed * (destinationPoints.x - this.pos.x + this.ownMove.x) * this.speed;
//     this.move.y += speed * (destinationPoints.y - this.pos.y + this.ownMove.y) * this.speed;
//     this.move.z += speed * (destinationPoints.z - this.pos.z) * this.speed;
// 
// 	this.pos.x += this.move.x;
// 	this.pos.y += this.move.y;
// 	this.pos.z += this.move.z;
//   }
// 
//   drawBird() {
// 	const { canvasWidth, canvasHeight, move } = this;
// 	let atan = Math.atan2(move.y * canvasHeight, move.x * canvasWidth);
// 	let pos = {
// 		x: this.pos.x * canvasWidth,
// 		y: this.pos.y * canvasHeight,
// 		z: this.pos.z * 1.5,
// 	  };
//     this.drawBody(pos, atan);
//   }
//   drawBody(pos, atan) {
// 	const { engine } = this;
// 	let wingHeight = this.cosWave(55, 55, this.wingFlapSpeed);//this.cosWave(startingWingTop, this.wingHeight, this.wingFlapSpeed)
// 	let wingHeight2 = this.cosWave(10, this.wingHeight, this.wingFlapSpeed);//this.cosWave(startingWingTop, this.wingHeight, this.wingFlapSpeed)
// 	//rotate   
// 	engine.save();
// 	engine.translate(pos.x, pos.y);
// 	engine.rotate(atan);
// 	engine.translate(-pos.x, -pos.y);
// 	engine.fillStyle = '#CCCCCC';
// 	let scale = 0.25;
// 	function scaleIt(num) {
// 		return num * scale;
// 	}
// 	//body
// 	engine.beginPath();
// 	engine.moveTo(pos.x, pos.y);
// 	engine.lineTo(pos.x + scaleIt(50), pos.y + scaleIt(10));
// 	engine.lineTo(pos.x + scaleIt(130), pos.y + scaleIt(10));
// 	engine.lineTo(pos.x + scaleIt(160), pos.y + scaleIt(20));
// 	engine.lineTo(pos.x + scaleIt(100), pos.y + scaleIt(40));
// 	engine.lineTo(pos.x + scaleIt(40), pos.y + scaleIt(20));
// 	engine.lineTo(pos.x + scaleIt(10), pos.y + scaleIt(30));
// 	engine.lineTo(pos.x, pos.y);
// 
// 	engine.fill();
// 	engine.closePath();
// 
// 	//wing
// 	// engine.stroke();
// 	engine.beginPath();
// 
// 	engine.moveTo(pos.x + scaleIt(50), pos.y + scaleIt(20));
// 	engine.lineTo(pos.x + scaleIt(70), pos.y);
// 	engine.lineTo(pos.x + scaleIt(20), pos.y - scaleIt(wingHeight));
// 	engine.lineTo(pos.x + scaleIt(120), pos.y - scaleIt(wingHeight2));
// 	engine.lineTo(pos.x + scaleIt(130), pos.y + scaleIt(20));
// 	engine.lineTo(pos.x + scaleIt(50), pos.y + scaleIt(20));
// 
// 	engine.fill();
// 	engine.closePath();
// 
// 	engine.restore();
//   }
// 
//   cosWave (startPoint, differential, speed) {
//     const currentDate = new Date();
//     return startPoint + (Math.cos(currentDate.getTime() * speed) * differential)
//   }
// 
// 
//   
//   applyPath(pathStack, engine) {
//     engine.moveTo(pathStack[0].x, pathStack[0].y);
// 
//     for (let i = 1; i < pathStack.length; i++) {
//       engine.lineTo(pathStack[i].x, pathStack[i].y);
//     }
//   }
// }
 * ========================================================================= */
