import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./Home.scss";
import MoveObjectToDestinationPoint from "./home-animation/HomeAnimation";

function Home() {
  useEffect(() => {
    let instance = new MoveObjectToDestinationPoint(
      "home-page--canvas-container"
    );
    instance.init();
    return () => instance.stop();
  }, []);
  return (
    <section id="home-page">
      <Helmet>
        <title>Utilspalooza — Canvas Animation Formulas &amp; Live Demos</title>
        <meta name="description" content="A living reference of canvas animation formulas — collision detection, trig, easing, bezier curves, and more — with live interactive demos and one-click TypeScript/JavaScript export." />
        <link rel="canonical" href="https://utilspalooza.com/" />
        <meta property="og:url" content="https://utilspalooza.com/" />
        <meta property="og:title" content="Utilspalooza — Canvas Animation Formulas &amp; Live Demos" />
      </Helmet>
      <div id="home-page--text-container">
        <div id="home-page--text-container_inner">
          <h2>utilspalooza</h2>
          <p>Readable animation math for canvas, creative coding, and visual experiments.</p>
          <div className="home-install-strip">npm i @utilspalooza/core</div>
          <div className="home-actions">
            <a href="/examples">Browse examples</a>
            <a className="home-secondary-link" href="/api">View API</a>
          </div>
        </div>
      </div>
      <div id="home-page--canvas-container"></div>
    </section>
  );
}

export default Home;
