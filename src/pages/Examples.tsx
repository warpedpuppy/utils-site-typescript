import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PrimaryCanvas from "../components/PrimaryCanvas/PrimaryCanvas";
import SideBar from "../components/SideBar/SideBar";
import "./Examples.scss";

function Examples() {
  const params = useParams();
  useEffect(() => {}, [params]);
  return (
    <section id="home-page">
      <SideBar />
      <PrimaryCanvas />
    </section>
  );
}

export default Examples;
