import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

/*
 * Klimt-Inspired Swirls — ported from the warpedpuppies portfolio "pretty little things".
 *
 * STATUS: SCAFFOLD. drawKlimt() below is intentionally BLANK — Ted ports it.
 * Original tech: Pixi.js ParticleContainer + pez.png (2 source files, heaviest particle count)
 *
 * NOTES: Two source files (klimtAnimation.js sets up, rainbowSwirls.js is the particle system). Loads pez.png and batches the most sprites of the bunch — the perf-sensitive one.
 *
 * The complete original source is at the BOTTOM of this file, commented out,
 * as the reference to port from. When drawKlimt() is implemented, delete the
 * placeholder() call in init() so the real animation runs.
 */

const ELI5 = `TODO (Ted): write the ELI5 explainer for Klimt-Inspired Swirls.`;

/**
 * drawKlimt — self-contained Canvas 2D draw routine.
 * (The CodePen pens embed this via .toString(), so keep it dependency-free:
 *  no module-level imports referenced inside the body.)
 *
 * TODO (Ted): port the commented original source at the bottom of this file
 * into here. Blank for now.
 */
export function drawKlimt(
  _ctx: CanvasRenderingContext2D,
  _width: number,
  _height: number
): void {
  // TODO: port me. See the commented original source at the bottom of this file.
}

const KlimtFormula: CollisionDetectionObject = {
  keyFunction: drawKlimt,
  dependencies: [],
  functionString: `// TODO (Ted): port drawKlimt() — see Klimt.ts`,
};

class Klimt extends Template {
  static t = "Klimt-Inspired Swirls";
  static l = "klimt";
  static f = KlimtFormula;
  title = "Klimt-Inspired Swirls";

  animationObject = KlimtFormula;
  animId = 0;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    // TODO (Ted): once drawKlimt() is implemented, start the rAF loop here
    // (e.g. this.animate()) and remove the placeholder() call below.
    this.placeholder();
  }

  /** Temporary stand-in until drawKlimt() is ported. Safe to delete then. */
  placeholder() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = "#888";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Klimt-Inspired Swirls — port in progress", this.halfWidth, this.halfHeight);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#555";
    ctx.fillText(
      "scaffold: original source is commented in Klimt.ts",
      this.halfWidth,
      this.halfHeight + 24
    );
  }

  stop() {
    cancelAnimationFrame(this.animId);
    super.stop();
  }
}

export default Klimt;

/* ===========================================================================
 * ORIGINAL PORTFOLIO SOURCE — reference for the Canvas 2D port. NOT executed.
 * Tech: Pixi.js ParticleContainer + pez.png (2 source files, heaviest particle count)
 * From: ~/Sites/warpedpuppies/portfolio/src/components/pretty-little-things/
 * ===========================================================================
// ── klimt-background/code/klimtAnimation.js ───────────────────────────────
// import * as PIXI from 'pixi.js';
// import RainbowSwirls from './rainbowSwirls';
// import Utils from '../../../../utils/utils';
// 
// class KlimtAnimation {
//     rainbowSwirlsQ = 4;
//     rainbowSwirlInstances = [];
//     pauseBoolean = false;
// 	halt = false;
//     constructor (canvas) {
//         this.rainbowSwirlInstances = [];
// 		let w = canvas.clientWidth, h = canvas.clientHeight;
// 		this.canvas = canvas;
//         Utils.setWidthAndHeight(w, h);
// 
//         const app = new PIXI.Application({
// 			background: '#000000',
// 			resizeTo: canvas,
// 		});
//         canvas.appendChild(app.view);
//         
//         const container = new PIXI.Container();
// 
//         app.stage.addChild(container);
// 
//         this.app = app;
//         
//         this.startXs = ['TL', 'BL', 'TR', 'BR']
//         for (let i = 0; i < this.rainbowSwirlsQ; i++) {
//           this.tileColumn = RainbowSwirls()
//           this.tileColumn.init(container, this.startXs[i], 30, 15, w, h)
//           this.tileColumn.addToStage()
//           this.rainbowSwirlInstances.push(this.tileColumn)
//         }
//         window.addEventListener('resize', this.resize)
//         app.ticker.add(this.ticker.bind(this));
//     }
//     resize = () => {
// 		let w = this.canvas.clientWidth, h = this.canvas.clientHeight;
// 		for (let i = 0; i < this.rainbowSwirlsQ; i++) {
// 			this.rainbowSwirlInstances[i].resize(w, h)
// 		}
//     }
//     pause() {
//         this.pauseBoolean = !this.pauseBoolean;
//     }
//     stop() {
// 		window.removeEventListener('resize', this.resize)
//         this.app.destroy();
//         for (let i = 0; i < this.rainbowSwirlsQ; i++) {
//             this.rainbowSwirlInstances[i].removeFromStage()
//         }
// 		this.halt = true;
//     }
//     ticker(delta) {
// 		if (this.halt) return ; 
//         if (!this.pauseBoolean) {
//             for (let i = 0; i < this.rainbowSwirlsQ; i++) {
//                 this.rainbowSwirlInstances[i].animate()
//             }
//         }
//        
//     }
//     
// }
// export default KlimtAnimation
//
// ── klimt-background/code/rainbowSwirls.js ────────────────────────────────
// import Utils from '../../../../utils/utils';
// import * as PIXI from 'pixi.js';
// export default function RainbowSwirls() {
//   return {
//     cont: undefined,
//     cols: {},
//     bricks: [],
//     utils: Utils,
//     brickHeight: 0,
//     curve: undefined,
//     curveCounter: 0,
//     curveQ: 0,
//     testCounter: 0,
//     curvedQs: [40, 80],
//     curves: [45, -45, 135, -135],
//     contObject: {},
//     objectPool: [],
//     objectPoolCounter: 0,
//     interval: 0,
//     colWidth: 5,
//     customWidth: undefined,
//     customHeight: undefined,
//     colors: [0xfff0f5, 0xe6e6fa, 0xff7575, 0xffb775, 0xfff175, 0xc3ff76, 0x7bffb8, 0x7de8ff, 0x799fff, 0xff93f7],
//     colorCounter: 0,
//     init (parentCont, quadrant, cw, ch, w, h) {
//       this.customHeight = ch;
//       this.customWidth = cw;
// 	  this.utils.canvasWidth = w;
// 	  this.utils.canvasHeight = h;
//       this.quadrant = quadrant
//       this.curve = this.curves[Math.floor(Math.random() * 4)]
//       this.app = this.utils.app;
//       
//       this.interval = this.utils.randomIntBetween(1,3);
//       this.parentCont = parentCont
// 
//       this.tileQ =  150 ;
//       this.cont = new PIXI.ParticleContainer(this.tileQ, {
// 		scale: true,
// 		position: true,
// 		rotation: true,
// 		uvs: true,
// 		alpha: true
// 	  });
// 
//       for (let i = 0; i < this.tileQ; i++) {
//         const s = this.brick();
//         s.alpha = 0.25;
//         s.tint = this.colors[this.colorCounter];
//         this.colorCounter++;
//         if (this.colorCounter > this.colors.length - 1) this.colorCounter = 0;
//         this.objectPool.push(s)
//       }
// 
//       const s = this.objectPool[this.objectPoolCounter];
//       this.objectPoolCounter++;
//       const newPos = this.newXY();
//       s.x = newPos.x;
//       s.y = newPos.y;
//       this.cont.addChild(s);
// 
//       this.curveQ = this.utils.randomIntBetween(this.curvedQs[0], this.curvedQs[1])
// 	
//     },
// 	resize(w, h) {
// 		this.utils.canvasHeight = h;
// 		this.utils.canvasWidth = w;
// 	},
//     brick () {
//       const s = PIXI.Sprite.from('/bmps/pez.png')
//       s.counter = 0
//       s.curveCounter = 0;
//       this.brickHeight = s.height
//       s.anchor.x = 0.5
//       s.anchor.y = 1
//       return s
//     },
//     newBrick () {
// 
//       const s = this.objectPool[this.objectPoolCounter];
//      
//       s.width = this.customWidth ? this.customWidth : s.width;
//       s.height = this.customHeight ? this.customHeight : s.height;
//       this.objectPoolCounter++
//       if (this.objectPoolCounter > this.objectPool.length - 1) {
//         this.objectPoolCounter = 0
//       }
// 
//       this.curveCounter++;
//       this.curve *= 1.05
//       const deg = this.utils.deg2rad(this.curve)
//       s.rotation = deg
//       if (this.curveCounter > this.curveQ) {
//         this.curve = this.curves[Math.floor(Math.random() * 4)]
//         this.curveCounter = 0
//         this.curveQ = this.utils.randomIntBetween(this.curvedQs[0], this.curvedQs[1])
//         const newPos = this.newXY()
//         s.y = newPos.y
//         s.x = newPos.x
//       }
//       const prevIndex = (this.objectPoolCounter > 1) ? this.objectPoolCounter - 2 : this.objectPool.length - 1
//       const prevX = this.objectPool[prevIndex].x
//       const prevY = this.objectPool[prevIndex].y
//       const prevRotation = this.objectPool[prevIndex].rotation
//       const newX = prevX + (s.height * Math.sin(prevRotation))
//       const newY = prevY - (s.height * Math.cos(prevRotation))
//       s.x = newX
//       s.y = newY
//       const buffer = 1
//       if (this.objectPoolCounter === 0 ||
// 				s.y < -buffer ||
// 				s.x < -buffer ||
// 				s.x > this.utils.canvasWidth + buffer ||
// 				s.y > this.utils.canvasHeight + buffer
//       ) {
//         const newPos = this.newXY()
//         s.x = newPos.x
//         s.y = newPos.y
//       }
//       this.cont.addChild(s)
//     },
//     newXY () {
//       if (this.quadrant === 'TL') {
//         return {
//           x: this.utils.canvasWidth * 0.25,
//           y:  this.utils.canvasHeight * 0.15
//         }
//       } if (this.quadrant === 'TR') {
//         return {
//           x: this.utils.canvasWidth * 0.75,
//           y:  this.utils.canvasHeight * 0.15
//         }
//       } if (this.quadrant === 'BL') {
//         return {
//           x: this.utils.canvasWidth * 0.75,
//           y:  this.utils.canvasHeight * 0.35
//         }
//       } if (this.quadrant === 'BR') {
//         return {
//           x: this.utils.canvasWidth * 0.25,
//           y:  this.utils.canvasHeight * 0.35
//         }
//       }
//     },
//     addToStage () {
//       this.parentCont.addChild(this.cont)
//     },
//     removeFromStage () {
//       this.parentCont.removeChild(this.cont)
//     },
//     animate () {
//       this.testCounter++;
//       if (this.testCounter % this.interval === 0) {this.newBrick(); this.testCounter = 0;}
//     }
//   }
// }
 * ========================================================================= */
