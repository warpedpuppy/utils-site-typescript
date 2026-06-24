# Utilspalooza

**[ [utilspalooza.com](https://utilspalooza.com) ]** &middot; **[ [TypeScript 5.x](https://typescriptlang.org) ]** &middot; **[ [Vite](https://vitejs.dev) ]**

> The naked math behind canvas animations — handcrafted from first principles.

An interactive visual laboratory for developers who want to see *how* the math works. Raw HTML5 Canvas, no external physics engines, strict TypeScript.

---

## ✏️ Adding a New Animation

Every animation in this site has exactly three canonical files. Never write the same math in two places.

> **The iron rule:** if a function exists in `core-functions/`, import it. Never copy-paste it.

---

### Step 1 — Write the pure math (`src/core-functions/`)

Just the equation. No canvas, no React, no browser APIs.

```typescript
// Named export. Concrete types. Self-contained — no imports from the rest of the site.
export function myFunction(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}
```

- **Named export** (not `export default`) — the function name must survive `.toString()` for CodePen embedding.
- **Concrete TypeScript types** — use `Point`, `Circle`, `Line` etc. from `../types/shapes`, not `any`.
- **No site imports** — this file should work pasted into any JS project.

---

### Step 2 — Write the animation (`src/core-animations/`)

One file, two jobs: a standalone `drawX()` function for CodePen, and a default class for the Examples page.

```typescript
import AnimationBaseClass from "./AnimationBaseClass";
import { myFunction } from "../core-functions/MyFunction";
import { MyFormula } from "../pages/createJSON/formulas/animation/MyFormula";

// Job 1: standalone draw function for CodePen (.toString() embeds this as plain JS)
// Must be self-contained — no references to module-level imports inside the function body.
export function drawMyAnimation(ctx: any, canvasWidth: any, canvasHeight: any): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // draw using myFunction(...)
}

const ELI5 = `🔵 My Animation — One-Line Takeaway

The sentence a user can repeat to a colleague: "This shows that ..."

HOW IT WORKS:
  The algorithm in plain English.

WHY THIS WORKS:
  The non-obvious insight.

CONTROLS
  • Slider name — what it does`;

// Job 2: animation class for the Examples page
export default class MyAnimationClass extends AnimationBaseClass {
  static t = "my animation title";   // human-readable title
  static l = "my-animation-title";   // URL slug (kebab-case)
  static f = MyFormula;
  title = "my animation title";
  animationObject = MyFormula;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5.replace(/\n/g, "<br>");
    this.draw();
  }

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawMyAnimation(this.ctx, this.canvasWidth, this.canvasHeight);
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
}
```

---

### Step 3 — Write the formula wrapper (`src/pages/createJSON/formulas/animation/`)

A thin shim so the "Create Utils File" page can expose your function. The `?raw` import (Vite feature) reads the source file as a string at build time — the displayed and downloaded code always matches the real source automatically.

```typescript
import { CollisionDetectionObject } from "../../../../types/types";
import { myFunction } from "../../../../core-functions/MyFunction";
import MyFunctionSource from "../../../../core-functions/MyFunction.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const MyFormula: CollisionDetectionObject = {
  keyFunction: myFunction,
  dependencies: [],
  interfaces: [],    // e.g. ["Point"] if your function takes a Point
  functionString: extractFunctionString(MyFunctionSource),
};
```

---

### Step 4 — Register in `src/SiteData.ts`

```typescript
import MyAnimationClass from "./core-animations/MyAnimation";

const SiteData: PrimaryObject = {
  animations: {
    // ... existing ...
    MyAnimationClass,  // position here = order in the sidebar
  },
};
```

Your animation now appears on the `/examples` page.

---

### Step 5 — Add a CodePen entry (`src/pages/studio/pens-examples.ts`)

```typescript
import { drawMyAnimation } from "../../core-animations/MyAnimation";

// In EXAMPLE_PENS array:
{
  group: "animations",
  key: "my-animation-title",
  label: "My Animation Title",
  blurb: "One sentence: what does it show?",
  payload: {
    title: "My Animation Title",
    js: buildCodePenJS(drawMyAnimation.toString()),
    css: FULLSCREEN_CSS,
    html: CANVAS_HTML,
  },
},
```

`drawMyAnimation.toString()` produces vanilla JS because there's no TypeScript syntax or imports in the function body.

---

## 🗂️ Adding a New Category

Add a key to `src/SiteData.ts`:

```typescript
const SiteData: PrimaryObject = {
  // ... existing ...
  topology: {
    MyNewAnimation,
  },
};
```

That's it. The category header appears in the sidebar automatically. No routing changes, no config files. Use the same string as `group` in any CodePen entries for that category.

---

## ✅ Checklist

```
[ ] src/core-functions/MyFunction.ts          — pure math, named export, concrete types
[ ] src/core-animations/MyAnimation.ts        — drawX() + default class + ELI5 string
[ ] src/pages/createJSON/formulas/animation/  — formula wrapper via ?raw + extractFunctionString
[ ] src/SiteData.ts                           — import + register under the right category
[ ] src/pages/studio/pens-examples.ts         — CodePen entry using drawX.toString()
[ ] npm run build                             — zero TypeScript errors
```

---

## 🏗️ Architecture

```text
src/
├── core-functions/     ← The math. One file per function. No canvas, no React.
├── core-animations/    ← One file per animation. Source for both Examples page and CodePen.
│   ├── AnimationBaseClass.tsx
│   └── animationTemplate.tsx
├── pages/
│   ├── examples/       ← /examples page
│   ├── studio/         ← /studio page (Build With It + CodePen pens)
│   └── createJSON/
│       └── formulas/   ← Wrappers that expose functions to "Create Utils File"
├── SiteData.ts         ← The governing document (see below)
└── types/              ← Shared TypeScript interfaces
```

### The governing document

`src/SiteData.ts` is the entire table of contents. It's a TypeScript object — not JSON, not XML. The keys are category names; the values are objects of animation classes. Whatever is in here appears in the `/examples` sidebar, in that order, with those category headers.

```typescript
const SiteData = {
  "animations": { BallBounce, LerpAnimation, ... },
  "collision detection": { PointToCircleCollision, ... },
  "fourier": { FourierEpicycles },
  // new key here → new category in sidebar, automatically
};
```

---

## 💻 Running Locally

```bash
git clone https://github.com/warpedpuppy/utils-site-typescript
cd utils-site-typescript
npm install
npm run dev
```

---

## 🤝 Contributing

Follow the five-step checklist. One hard constraint: **one canonical source per function**. If you find yourself writing the same equation in two files, stop — put it in `core-functions/` and import from there.

---

## 📄 License

MIT. See `LICENSE`.
