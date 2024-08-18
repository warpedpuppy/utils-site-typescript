import { createRef, useEffect } from "react";
import "./Home.scss";
import MoveObjectToDestinationPoint from "../../siteData/animations/trig/MoveObjectToDestinationPoint";

function Home() {
  const canvasRef = createRef<any>();
  useEffect(() => {
    let instance = new MoveObjectToDestinationPoint(canvasRef.current!);
    instance.init();
    return () => instance.stop();
  }, [canvasRef]);
  return (
    <section id="home-page">
      <div id="home-page--text-container">
        <div id="home-page--text-container_inner">
          <p>sdfgsdfgsdfg</p>
        </div>
      </div>
      <div id="home-page--canvas-container" ref={canvasRef}></div>
    </section>
  );
}

export default Home;
