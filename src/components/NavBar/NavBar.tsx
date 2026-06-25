import "./NavBar.scss";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UtilspaloozaLogo from "../Logo/UtilspaloozaLogo";
function NavBar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setCollapsed(false);
  }, [location.pathname]);

  return (
    <nav>
      <h1>
        <div className="logo-container">
          <UtilspaloozaLogo />
        </div>
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
        <Link to="/create-json">recipes</Link>
        <Link to="/api">api</Link>
        <Link to="/studio">studio</Link>
        <Link to="/about">about</Link>
      </div>
    </nav>
  );
}

export default NavBar;
