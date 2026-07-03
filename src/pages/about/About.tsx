import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./About.scss";

function About() {
  return (
    <div id="about-wrapper">
      <Helmet>
        <title>About — Utilspalooza</title>
        <meta name="description" content="Utilspalooza is a canvas animation formula reference built by Ted Walther, a software engineer and educator in Maine. Learn what it is and how to use it." />
        <link rel="canonical" href="https://utilspalooza.com/about" />
        <meta property="og:url" content="https://utilspalooza.com/about" />
        <meta property="og:title" content="About — Utilspalooza" />
      </Helmet>
      <div id="about-wrapper--inner">
        <h2>What is Utilspalooza?</h2>
        <p>
          Every animation project starts the same way: hunting down the same
          trigonometry helpers, collision-detection routines, and easing
          functions you've written a dozen times before. Utilspalooza collects
          the most common canvas and animation formulas in one place — each one
          paired with a live, interactive demo so you can see exactly what it
          does before you commit it to your codebase.
        </p>

        <h2>Grab one function's code</h2>
        <p>
          Head to <strong>Copy Code</strong> and check off the functions you
          need. The site assembles clean, typed snippets on the fly — ready to
          copy into a project today, or download as a standalone TypeScript or
          JavaScript file. No install, no library, just the code.
        </p>

        <h2>Or take the whole toolbox</h2>
        <p>
          Want more than a snippet? The full set ships as a typed, published npm
          package: <code>npm i @utilspalooza/core</code> — or drop it in from a
          CDN with no build step at all. The{" "}
          <Link to="/quickstart">quickstart</Link> shows the smallest working
          file, and the <Link to="/api">API reference</Link> lists every function
          with a live demo.
        </p>

        <h2>New to canvas?</h2>
        <p>
          If you've never wired up a canvas animation before, don't start by
          reading — start by running.{" "}
          <Link to="/quickstart">Start from the smallest possible file</Link>: one
          HTML page that bounces a ball, with nothing hidden and no build step.
        </p>

        <h2>How to use it</h2>
        <p>
          Browse the example library on the left. Click any animation to see
          the live canvas demo and inspect the underlying code. When you find
          functions you want to keep, tick the checkbox next to the name —
          they'll be bundled into a ready-to-copy snippet automatically.
        </p>

        <h2>Who made this</h2>
        <p>
          <strong>Ted</strong> — developer and educator. Utilspalooza is a product of{" "}
          <a href="https://warpedpuppy.com" target="_blank" rel="noopener noreferrer">
            Warped Puppy LLC
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default About;
