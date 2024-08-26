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
            Do you ever want to make a quick animation, but don't want to get
            out your old trig books? Well, this site is for you.
          </p>
          <p>
            Just go to the "create" page, click the functions you need and then
            copy and paste the compiled document. Easy Peasy.
          </p>
        </div>
      </div>
      <div id="home-page--canvas-container"></div>
    </section>
  );
}

export default Home;
