# 🎡 Utilspalooza

**[ [Live Visual Lab](https://utilspalooza.com) ]** &middot; **[ [TypeScript 5.x](https://typescriptlang.org) ]** &middot; **[ [Built with Vite](https://vitejs.dev) ]**

> **The Naked Math Behind Canvas Animations — Handcrafted from First Principles.**

**[Utilspalooza](https://utilspalooza.com)** is an interactive, zero-dependency visual laboratory built for developers who want to understand _how_ the magic works. Instead of hiding equations behind heavy, black-box animation frameworks, this sandbox uses raw **HTML5 Canvas**, native math vectors, and strict **TypeScript** to break down physics and geometry code from first principles.

---

## 🚀 Live Visual Laboratory

Explore the math engines and tweak constants in real-time: **[utilspalooza.com](https://utilspalooza.com)**

---

## 🧮 What's Inside: The Math & Physics Core

Every single component in this project pairs a mathematical utility function with a dedicated, isolated rendering engine. You can dive straight into the source code to see:

- **Vector Mechanics:** Pure coordinate calculations handling velocity vectors, gravity constants, and momentum transfer (check out the `ballBounce` engine).
- **Friction & Elasticity Matrices:** Raw coefficient math simulating kinetic energy loss during boundary impacts without external engines.
- **Trigonometric Oscillations:** Handcoded wave functions, angular rotation matrices, and smooth step interpolations.
- **Predictable Canvas State Loops:** Clean `requestAnimationFrame` lifecycle hooks that demonstrate how to manage delta time and prevent frame drops.

---

## 🛠️ The DIY Tech Stack

This environment is intentionally lean to ensure nothing abstracts the math:

- **Bundler & Build Pipeline:** [Vite](https://vitejs.dev) (For near-instantaneous Hot Module Replacement while tweaking math variables)
- **Language Core:** [TypeScript](https://typescriptlang.org) (Strict structural typings ensuring coordinate payloads are perfectly mapped)
- **Graphics UI:** Pure HTML5 Canvas API (No WebGL wrapper libraries, no external physics injectors)
- **Layout Layer:** React 18 & Modular SCSS (Serving purely as the UI control deck for updating simulation parameters)

---

## 📚 Core Functions Reference

All mathematical utilities are collected in `src/core-functions/` — the canonical source of truth for every formula used throughout the site. Each function is fully typed and ready to import.

### Physics & Motion

| Function | Purpose |
|----------|---------|
| `BallBounce(ball, stage)` | Gravity, wall bouncing, and friction physics |
| `BallToBallBounce(ball1, ball2, spring)` | Spring-based elastic collision between two objects |
| `MoveAlongLine(origin, destination, ratio)` | Linear interpolation along a line |
| `MoveToward(current, target, speed)` | Constant-speed movement toward a target |
| `OrbitalMotion::gravitationalStep(orbiter, body)` | Newtonian gravitational physics step |
| `SphereLighting(sphere, lightSource, reach)` | Radial highlight position for lit sphere effect |

### Geometry & Shapes

| Function | Purpose |
|----------|---------|
| `CircleFromThreePoints(p1, p2, p3)` | Find circumcircle from three points |
| `DistributeAroundCircle(center, radius, count)` | Evenly space points on a circle |
| `EquilateralTriangle(radius, center, angle)` | Generate three equilateral points around a center |
| `FindPointAroundCircle(center, radius, percent)` | Get point at given percent around circle perimeter |
| `GetPointOnLine(start, end, t)` | Linear interpolation point on a line (t = 0–1) |
| `GetRotation(from, to)` | Angle from one point to another (radians) |
| `GetTriangleData(p1, p2)` | Hypotenuse, angle, opposite/adjacent sides from line |
| `LineLength(line)` | Distance between line start and end points |
| `QuadraticBezier(t, p0, p1, p2)` | De Casteljau quadratic curve at parameter t |
| `Rectangle(width, height, angle, options)` | Generate rotatable rectangle vertices |
| `Star::DrawStar(spikes, inner, outer, angle)` | Generate star polygon vertices |
| `BezierCurve()` | Bézier interpolation utility |
| `UnitCirclePoint(angle)` | Point on unit circle at given angle |

### Math & Interpolation

| Function | Purpose |
|----------|---------|
| `Lerp(a, b, t)` | Linear interpolation between two numbers |
| `Easing::easeInOut()` | Common easing functions (linear, quad, elastic, bounce) |
| `DegToRad(degrees)` | Convert degrees to radians |
| `RadToDeg(radians)` | Convert radians to degrees |
| `SineCurve(start, differential, speed)` | Oscillating sine wave value |
| `SineWave()` | Wave generation utility |
| `RandomNumberBetween(min, max)` | Random decimal in range |
| `RandomIntegerBetween(min, max)` | Random integer in range |
| `NumberWithCommas(x)` | Format number with thousands separators |
| `CenterOnParent(item, parent)` | Calculate centered position within container |

### Collision Detection — Object API

These functions use structured types (`Point`, `Circle`, `Line`, `Polygon`):

| Function | Signature |
|----------|-----------|
| `PointCircle(point, circle)` | Point inside/touching circle |
| `CircleCircle(c1, c2)` | Two circles overlapping |
| `LinePoint(line, point)` | Point on/near line segment |
| `LineCircle(line, circle)` | Line segment touching circle |
| `LineLine(line1, line2)` | Two line segments intersecting |
| `PolygonPoint(polygon, point)` | Point inside polygon (ray-casting) |
| `PolygonCircle(polygon, circle)` | Polygon edges/interior vs circle |
| `PolygonLine(polygon, line)` | Polygon edges vs line segment |
| `PolygonPolygon(poly1, poly2)` | Two polygons overlapping |

### Collision Detection — Flat API

These functions use individual x, y, w, h parameters (legacy):

| Function | Purpose |
|----------|---------|
| `PointToCircle(px, py, cx, cy, r)` | Point vs circle collision |
| `PointToRect(px, py, rx, ry, w, h)` | Point vs rectangle collision |
| `CircleToCircle(x1, y1, r1, x2, y2, r2)` | Circle vs circle |
| `CircleToRect(cx, cy, r, rx, ry, w, h)` | Circle vs rectangle |
| `LineToPoint(x1, y1, x2, y2, px, py)` | Line segment vs point |
| `LineToCircle(x1, y1, x2, y2, cx, cy, r)` | Line vs circle |
| `LineToLine(x1, y1, x2, y2, x3, y3, x4, y4)` | Line vs line |
| `LineToRect(x1, y1, x2, y2, rx, ry, w, h)` | Line vs rectangle |
| `RectToRect(x1, y1, w1, h1, x2, y2, w2, h2)` | Rectangle vs rectangle |
| `PolygonToPolygon()` | Polygon vs polygon |

### Complex Algorithms

| Function | Purpose |
|----------|---------|
| `DFT()` | Discrete Fourier Transform for epicycles |
| `GameOfLife()` | Conway's Game of Life rules |
| `WaveAmplitude()` | Wave interference amplitude calculation |
| `LensDeflection()` | Gravitational lensing deflection angle |
| `GRStep()` | General relativity orbital precession step |
| `GetRandomColors(hueFilter)` | Random HSL color in range (blue/green/etc) |
| `Distance(p1, p2)` | Euclidean distance between two points |

### Drawing Helpers

| Function | Purpose |
|----------|---------|
| `DrawStar(cx, cy, spikes, inner, outer, angle)` | Render star to canvas context |
| `DrawRectWithTrig(cx, cy, w, h, angle)` | Render rotated rectangle to canvas |
| `DrawEquilateralTriangle(cx, cy, size, angle)` | Render equilateral triangle to canvas |
| `DistributeAroundCircleFlat(cx, cy, r, count)` | Points on circle (flat API) |

---

## 💻 Spin Up the Lab Locally

Clone and run the environment locally to start injecting your own custom equations into the rendering pipeline.

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com
   cd utils-site-typescript
   ```

2. **Install the lightweight dependencies:**

   ```bash
   npm install
   ```

3. **Ignite the Vite dev server:**

   ```bash
   npm run dev
   ```

4. **Start Modding:**
   Open your browser to the local Vite port. Try editing the acceleration vectors inside the `src/` functions directly—the browser will hot-reload your physics changes instantly without resetting the control deck state.

---

## 🏗️ Architecture for Math Exploration

```text
├── src/
│   ├── functions/       # 🧠 THE CORE MATH: Pure TypeScript utility logic files
│   │   └── ...          # (Look here for raw formulas, bounding collision checks, etc.)
│   ├── components/      # 🖥️ THE CANVAS RENDERS: Wrappers that bind math arrays to the screen
│   │   └── ballBounce/  # Real-time interactive canvas engine demonstrating vector bounces
│   └── styles/          # 🎨 Clean SCSS workspace configuration files
├── html-explanations/   # 📝 Engineering teardowns and geometric guides for individual modules
└── vite.config.ts       # Optimized dev engine pipeline config
```

---

## 🤝 Fork & Hack

Want to see your favorite geometric formula visualized? Contributions that add new mathematical utility files or interactive canvas playgrounds are highly welcome.

1. Fork this sandbox repository.
2. Draft a new functional formula module inside `src/functions/`.
3. Scaffold a vanilla canvas visualizer to render your vector matrices.
4. Submit a Pull Request so we can expand the laboratory map!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤖 A Note on AI & Engineering Integrity

The core mathematics, formulas, and rendering logic in this laboratory were handcrafted from first principles. However, AI tools have played a growing role in this project over time — and I believe in being transparent about that.

**Any code that originated with AI will be explicitly identified as such** — both in the source file comments and in the "AI Made" section of the examples page on the site. The older animations (collision detection, trig utilities, etc.) are entirely hand-written. The newer sections (Fourier epicycles, Game of Life, Perlin flow fields, Bézier curves) were AI-generated and are labeled accordingly.

Beyond code generation, AI was also used for:

- **Memory Leak Auditing:** Web applications utilizing heavy HTML5 Canvas rendering cycles and continuous `requestAnimationFrame` hooks are highly prone to memory overhead issues. I had AI scrutinize my component lifecycles, which successfully pinpointed and repaired several nuanced canvas cache and listener leaks.
- **Documentation Architecture:** This very README, along with its strategic positioning for the creative coding community, was co-authored alongside AI to ensure maximum scannability and structural clarity.
