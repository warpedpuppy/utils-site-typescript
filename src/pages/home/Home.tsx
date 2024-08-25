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
          <p>sdfgsdfgsdfg</p>
        </div>
      </div>
      <div id="home-page--canvas-container"></div>
    </section>
  );
}

export default Home;
