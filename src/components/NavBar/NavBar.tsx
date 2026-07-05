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
    <nav className="site-nav">
      <div className="site-nav__brand">
        <div className="logo-container">
          <UtilspaloozaLogo />
        </div>
        <NavLink to="/" end>utilspalooza</NavLink>
      </div>

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
        <NavLink to="/quickstart">start here</NavLink>
        <NavLink to="/examples">examples</NavLink>
        <NavLink to="/create-json">copy code</NavLink>
        <NavLink to="/api">api</NavLink>
        <NavLink to="/studio">projects</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
