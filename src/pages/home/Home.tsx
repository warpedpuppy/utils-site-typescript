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
          <p>
            If you are like me, you enjoy tinkering with web animations, but
            don't want to rely on a library to
          </p>
          <p>
            Just go to the "generate utils" page and choose which functions you
            want, then click the other page and you can copy and paste it into
            your file system.
          </p>
        </div>
      </div>
      <div id="home-page--canvas-container"></div>
    </section>
  );
}

export default Home;
