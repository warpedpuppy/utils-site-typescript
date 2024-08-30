import { ReactNode } from "react";
import "./SideBar.scss";

function SideBar({ sideMenu }: { sideMenu: ReactNode[] }) {
  return (
    <>
      <dl id="side-bar">{sideMenu}</dl>
    </>
  );
}

export default SideBar;
