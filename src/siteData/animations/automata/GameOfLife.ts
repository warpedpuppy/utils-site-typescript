import Template from "../animationTemplate";

const ELI5 = `🧬 Conway's Game of Life — What's going on?

This is a "cellular automaton" — a grid of cells that are either alive or dead.
Every tick, the whole grid updates at once using just 4 rules:

  1. A live cell with fewer than 2 live neighbors → dies (underpopulation)
  2. A live cell with 2 or 3 live neighbors    → survives
  3. A live cell with more than 3 live neighbors → dies (overpopulation)
  4. A dead cell with exactly 3 live neighbors  → becomes alive (reproduction)

That's it. Four rules. Yet from these rules emerge:
  - Stable shapes that never change (still lifes)
  - Shapes that oscillate back and forth (oscillators like the blinker)
  - Shapes that travel across the grid (spaceships like the glider)
  - Machines that generate infinite gliders (the Glider Gun)

No one designed these behaviors — they emerge from the rules.

This is a foundational idea in complexity theory: simple local rules
can produce astonishingly complex global behavior.

Click or drag on the grid to draw cells. Use the controls to run it.`;

import { CollisionDetectionObject } from "../../../types/types";

function nextGeneration(grid: Uint8Array, cols: number, rows: number): Uint8Array {
  const next = new Uint8Array(grid.length);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = (row + dr + rows) % rows;
          const c = (col + dc + cols) % cols;
          neighbors += grid[r * cols + c];
        }
      }
      const alive = grid[row * cols + col];
      next[row * cols + col] =
        alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
              : (neighbors === 3 ? 1 : 0);
    }
  }
  return next;
}

const GameOfLifeFormula: CollisionDetectionObject = {
  keyFunction: nextGeneration,
  dependencies: [],
  functionString: `function nextGeneration(grid: Uint8Array, cols: number, rows: number): Uint8Array {
  const next = new Uint8Array(grid.length);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = (row + dr + rows) % rows;
          const c = (col + dc + cols) % cols;
          neighbors += grid[r * cols + c];
        }
      }
      const alive = grid[row * cols + col];
      next[row * cols + col] =
        alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
              : (neighbors === 3 ? 1 : 0);
    }
  }
  return next;
}`,
};

const CELL = 12; // px per cell

// Preset patterns (relative cell coords)
const PRESETS: Record<string, number[][]> = {
  glider: [[1,0],[2,1],[0,2],[1,2],[2,2]],
  blinker: [[0,0],[1,0],[2,0]],
  pulsar: [
    [2,0],[3,0],[4,0],[8,0],[9,0],[10,0],
    [0,2],[5,2],[7,2],[12,2],
    [0,3],[5,3],[7,3],[12,3],
    [0,4],[5,4],[7,4],[12,4],
    [2,5],[3,5],[4,5],[8,5],[9,5],[10,5],
    [2,7],[3,7],[4,7],[8,7],[9,7],[10,7],
    [0,8],[5,8],[7,8],[12,8],
    [0,9],[5,9],[7,9],[12,9],
    [0,10],[5,10],[7,10],[12,10],
    [2,12],[3,12],[4,12],[8,12],[9,12],[10,12],
  ],
  gliderGun: [
    [24,0],[22,1],[24,1],[12,2],[13,2],[20,2],[21,2],[34,2],[35,2],
    [11,3],[15,3],[20,3],[21,3],[34,3],[35,3],
    [0,4],[1,4],[10,4],[16,4],[20,4],[21,4],
    [0,5],[1,5],[10,5],[14,5],[16,5],[17,5],[22,5],[24,5],
    [10,6],[16,6],[24,6],
    [11,7],[15,7],
    [12,8],[13,8],
  ],
};

class GameOfLife extends Template {
  static t = "Conway's Game of Life";
  static l = "game-of-life";
  static f = GameOfLifeFormula;
  title = "Conway's Game of Life";

  animationObject = GameOfLifeFormula;

  cols: number = 0;
  rows: number = 0;
  grid: Uint8Array = new Uint8Array(0);
  nextGrid: Uint8Array = new Uint8Array(0);
  running: boolean = false;
  generation: number = 0;
  tickInterval: any = null;
  speed: number = 100; // ms between ticks
  painting: boolean = false;
  paintValue: number = 1;
  animId: number = 0;
  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;
  genSpan: HTMLSpanElement | null = null;
  playBtn: HTMLButtonElement | null = null;

  setupGrid() {
    this.cols = Math.floor(this.canvasWidth / CELL);
    this.rows = Math.floor(this.canvasHeight / CELL);
    this.grid = new Uint8Array(this.cols * this.rows);
    this.nextGrid = new Uint8Array(this.cols * this.rows);
    this.generation = 0;
  }

  loadPreset(name: string) {
    this.grid.fill(0);
    const pts = PRESETS[name];
    if (!pts) return;
    const offX = Math.floor(this.cols / 2) - 8;
    const offY = Math.floor(this.rows / 2) - 8;
    for (const [dc, dr] of pts) {
      const c = offX + dc;
      const r = offY + dr;
      if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
        this.grid[r * this.cols + c] = 1;
      }
    }
    this.generation = 0;
  }

  randomize() {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Math.random() < 0.3 ? 1 : 0;
    }
    this.generation = 0;
  }

  tick() {
    this.grid = nextGeneration(this.grid, this.cols, this.rows);
    this.generation++;
    if (this.genSpan) this.genSpan.textContent = `gen: ${this.generation}`;
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;z-index:10;background:rgba(15,15,26,0.92);color:#d0ffd0;border:1px solid rgba(57,255,20,0.3);padding:6px 10px;border-radius:6px;font-family:monospace;font-size:12px;max-width:90%;";

    const makeBtn = (label: string, onClick: () => void, color = "rgba(57,255,20,0.15)") => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = `padding:3px 8px;cursor:pointer;border:1px solid rgba(57,255,20,0.4);border-radius:4px;background:${color};color:#d0ffd0;font-family:monospace;font-size:12px;`;
      b.addEventListener("click", onClick);
      return b;
    };

    this.playBtn = makeBtn("▶ play", () => {
      if (this.running) {
        this.running = false;
        clearInterval(this.tickInterval);
        this.playBtn!.textContent = "▶ play";
      } else {
        this.running = true;
        this.tickInterval = setInterval(() => this.tick(), this.speed);
        this.playBtn!.textContent = "⏸ pause";
      }
    });

    this.controlsDiv.appendChild(this.playBtn);
    this.controlsDiv.appendChild(makeBtn("step", () => this.tick()));
    this.controlsDiv.appendChild(makeBtn("clear", () => {
      this.running = false;
      clearInterval(this.tickInterval);
      if (this.playBtn) this.playBtn.textContent = "▶ play";
      this.grid.fill(0);
      this.generation = 0;
      if (this.genSpan) this.genSpan.textContent = "gen: 0";
    }));
    this.controlsDiv.appendChild(makeBtn("random", () => this.randomize()));

    const sep = document.createElement("span");
    sep.textContent = "presets:";
    this.controlsDiv.appendChild(sep);

    for (const name of Object.keys(PRESETS)) {
      this.controlsDiv.appendChild(makeBtn(name, () => this.loadPreset(name)));
    }

    const speedLabel = document.createElement("span");
    speedLabel.textContent = "speed:";
    this.controlsDiv.appendChild(speedLabel);

    const speedSel = document.createElement("select");
    speedSel.style.cssText = "font-family:monospace;font-size:12px;border-radius:4px;border:1px solid rgba(57,255,20,0.4);background:rgba(57,255,20,0.1);color:#d0ffd0;";
    [["slow", "250"], ["medium", "100"], ["fast", "40"], ["turbo", "16"]].forEach(([label, val]) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = label;
      if (val === "100") opt.selected = true;
      speedSel.appendChild(opt);
    });
    speedSel.addEventListener("change", () => {
      this.speed = Number(speedSel.value);
      if (this.running) {
        clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => this.tick(), this.speed);
      }
    });
    this.controlsDiv.appendChild(speedSel);

    this.genSpan = document.createElement("span");
    this.genSpan.textContent = "gen: 0";
    this.genSpan.style.color = "#39ff14";
    this.controlsDiv.appendChild(this.genSpan);

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:420px;max-height:70vh;overflow-y:auto;background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;z-index:20;box-shadow:0 4px 20px rgba(0,0,0,0.4);";
    this.infoPanel.textContent = ELI5;
    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText = "position:absolute;top:8px;right:8px;background:none;border:none;color:#cdd6f4;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display = this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    infoBtn.style.background = "rgba(57,255,20,0.3)";
    infoBtn.style.color = "#d0ffd0";
    infoBtn.style.borderColor = "rgba(57,255,20,0.6)";
    this.controlsDiv.appendChild(infoBtn);

    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  init() {
    this.setupGrid();
    this.loadPreset("glider");
    this.addControls();
    this.renderLoop();
    this.running = true;
    this.tickInterval = setInterval(() => this.tick(), this.speed);
    if (this.playBtn) this.playBtn.textContent = "⏸ pause";
  }

  renderLoop = () => {
    this.drawGrid();
    this.animId = requestAnimationFrame(this.renderLoop);
  };

  drawGrid() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;

    // Dark background
    ctx.fillStyle = "#0f0f1a";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Grid lines (subtle on dark bg)
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= this.cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, this.rows * CELL);
      ctx.stroke();
    }
    for (let r = 0; r <= this.rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(this.cols * CELL, r * CELL);
      ctx.stroke();
    }

    // Cells — bright lime green on dark bg
    ctx.fillStyle = "#39ff14";
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r * this.cols + c]) {
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }
  }

  getCellFromEvent(e: PointerEvent): [number, number] {
    const mx = e.pageX - this.left;
    const my = e.pageY - this.top;
    return [Math.floor(mx / CELL), Math.floor(my / CELL)];
  }

  pointerDownHandler(e: PointerEvent) {
    const [c, r] = this.getCellFromEvent(e);
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return;
    this.paintValue = this.grid[r * this.cols + c] ? 0 : 1;
    this.grid[r * this.cols + c] = this.paintValue;
    this.painting = true;
  }

  pointerMoveHandler(e: PointerEvent) {
    if (!this.painting) return;
    const [c, r] = this.getCellFromEvent(e);
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return;
    this.grid[r * this.cols + c] = this.paintValue;
  }

  pointerUpHandler(_e: PointerEvent) {
    this.painting = false;
  }

  stop() {
    cancelAnimationFrame(this.animId);
    clearInterval(this.tickInterval);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default GameOfLife;
