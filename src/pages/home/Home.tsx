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
            This site will help you create animations on the web by constructing
            a custom "utils" file that will contain all of the animation
            functions you need. Can't remember whether it is sine or cosine that
            helps you fine the y value of a point around a circle? This site
            will generate a function for you to calculate it. (it is the sine
            btw -- remember the "opposite" side will be the vertical one)
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
