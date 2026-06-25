import { Helmet } from "react-helmet-async";
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

        <h2>Copy code recipes</h2>
        <p>
          Head to <strong>Copy Code</strong> and check off the functions you
          need. The site assembles clean, typed snippets on the fly — ready to
          copy into a project, use with npm imports, or download as a standalone
          TypeScript or JavaScript file when that is still the easiest path.
        </p>

        <h2>How to use it</h2>
        <p>
          Browse the example library on the left. Click any animation to see
          the live canvas demo and inspect the underlying code. When you find
          functions you want to keep, tick the checkbox next to the name —
          they'll be bundled into your copyable recipe automatically.
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
