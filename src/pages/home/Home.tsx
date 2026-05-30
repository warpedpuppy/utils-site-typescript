import { useEffect } from "react";
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
      <div id="home-page--text-container">
        <div id="home-page--text-container_inner">
          <h2>utilspalooza</h2>
          <p>A living reference of animation formulas — collision detection, trig, easing, and more — with live canvas demos and one-click code export.</p>
          <a href="/examples">Browse examples →</a>
        </div>
      </div>
      <div id="home-page--canvas-container"></div>
    </section>
  );
}

export default Home;
