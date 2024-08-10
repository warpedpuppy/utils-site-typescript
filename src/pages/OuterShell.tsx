import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
function OuterShell() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default OuterShell;
