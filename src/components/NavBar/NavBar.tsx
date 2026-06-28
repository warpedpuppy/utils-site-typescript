import "./NavBar.scss";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
        <NavLink to="/" end>utilspalooza</NavLink>
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
        <NavLink to="/examples">examples</NavLink>
        <NavLink to="/create-json">recipes</NavLink>
        <NavLink to="/api">api</NavLink>
        <NavLink to="/studio">studio</NavLink>
        <NavLink to="/about">about</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
