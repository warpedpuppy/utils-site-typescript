import { createRef, useEffect } from "react";
import "./Home.scss";
import MoveObjectToDestinationPoint from "../../siteData/animations/trig/MoveObjectToDestinationPoint";

function Home() {
  const canvasRef = createRef<HTMLDivElement>();
  useEffect(() => {
    let instance = new MoveObjectToDestinationPoint();
    instance.init(canvasRef.current!);
    return () => instance.stop();
  }, [canvasRef]);
  return (
    <section id="home-page">
      <div id="home-page--canvas-container" ref={canvasRef}></div>
    </section>
  );
}

export default Home;
