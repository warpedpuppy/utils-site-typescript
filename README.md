# 🎡 Utilspalooza

**[ [Live Visual Lab](https://utilspalooza.com) ]** &middot; **[ [TypeScript 5.x](https://typescriptlang.org) ]** &middot; **[ [Built with Vite](https://vitejs.dev) ]**

> **The Naked Math Behind Canvas Animations — Handcrafted from First Principles.**

> **The Naked Math Behind Canvas Animations — Handcrafted in TypeScript.**

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

Make no mistake: **the core mathematics, formulas, and rendering logic in this laboratory were entirely handcrafted by me.** These utility algorithms are my prized possessions, forged out of a deep love for physics and creative coding.

However, to ensure this playground runs at a locked 60fps without stalling your browser, I integrated modern AI tools into my workflow for specialized engineering review:

- **Memory Leak Auditing:** Web applications utilizing heavy HTML5 Canvas rendering cycles and continuous `requestAnimationFrame` hooks are highly prone to memory overhead issues. I had AI scrutinize my component lifecycles, which successfully pinpointed and repaired several nuanced canvas cache and listener leaks.
- **Documentation Architecture:** This very README, along with its strategic positioning for the creative coding community, was co-authored alongside AI to ensure maximum scannability and structural clarity.

The code remains strictly mine—but it is fortified with AI-assisted optimizations to give you the smoothest possible sandbox experience.
