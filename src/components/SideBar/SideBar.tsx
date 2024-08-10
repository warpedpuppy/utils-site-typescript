import { ReactNode } from "react";
import "./SideBar.scss";

function SideBar({ sideMenu }: { sideMenu: Array<ReactNode> }) {
  return <dl id="side-bar">{sideMenu}</dl>;
}

export default SideBar;
