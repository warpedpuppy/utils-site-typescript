import "./NavBar.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
function NavBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav>
      <h1>
        <Link to="/">utilspalooza</Link>
      </h1>

      <div
        id="hamburger"
        onClick={() => setCollapsed(!collapsed)}
        className={collapsed ? "collapsed" : ""}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div id="nav-links" className={collapsed ? "collapsed" : ""}>
        <Link to="/examples">examples</Link>
        <Link to="/create-json">create utils file</Link>
        <Link to="/about">about</Link>
      </div>
    </nav>
  );
}

export default NavBar;
