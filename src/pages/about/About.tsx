import "./About.scss";

function About() {
  return (
    <div id="about-wrapper">
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

        <h2>Build your own utils file</h2>
        <p>
          Head to <strong>Create Utils File</strong> and check off the
          functions you need. The site assembles a clean, typed TypeScript
          module on the fly — ready to copy or download directly into your
          project. No build step, no dependencies, no boilerplate.
        </p>

        <h2>How to use it</h2>
        <p>
          Browse the example library on the left. Click any animation to see
          the live canvas demo and inspect the underlying code. When you find
          functions you want to keep, tick the checkbox next to the name —
          they'll be bundled into your exportable utils file automatically.
        </p>
      </div>
    </div>
  );
}

export default About;
