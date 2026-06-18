import "./NavBar.scss";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
          {/* <svg
            className="rocket-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <defs>
              <linearGradient
                id="exhaustGrad"
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FF8C00" />
                <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="wingGradLeft"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#E0E0E0" />
                <stop offset="100%" stopColor="#B0B0B0" />
              </linearGradient>

              <linearGradient
                id="bodyGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FF5252" />
                <stop offset="100%" stopColor="#D32F2F" />
              </linearGradient>

              <linearGradient
                id="windowGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#E1F5FE" />
                <stop offset="100%" stopColor="#0288D1" />
              </linearGradient>
            </defs>

            <g transform="rotate(-45 256 256)">
              <path
                d="M 256 390 Q 226 440 256 512 Q 286 440 256 390 Z"
                fill="url(#exhaustGrad)"
              />
              <path
                d="M 226 280 L 150 320 Q 150 280 180 260 Z"
                fill="url(#wingGradLeft)"
              />
              <path
                d="M 286 280 L 362 320 Q 362 280 332 260 Z"
                fill="#E0E0E0"
              />
              <path
                d="M 256 120 C 216 200 190 280 190 320 C 190 340 222 340 256 340 C 290 340 322 340 322 320 C 322 280 296 200 256 120 Z"
                fill="url(#bodyGrad)"
              />
              <path
                d="M 256 120 C 246 160 220 220 200 260 L 312 260 C 292 220 266 160 256 120 Z"
                fill="#FF5252"
              />
              <circle
                cx="256"
                cy="220"
                r="22"
                fill="url(#windowGrad)"
                stroke="#424242"
                strokeWidth="4"
              />
              <circle
                cx="256"
                cy="280"
                r="22"
                fill="url(#windowGrad)"
                stroke="#424242"
                strokeWidth="4"
              />
              <circle
                cx="248"
                cy="212"
                r="5"
                fill="#FFFFFF"
                opacity="0.6"
              />
              <circle
                cx="248"
                cy="272"
                r="5"
                fill="#FFFFFF"
                opacity="0.6"
              />
            </g>
          </svg> */}
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
        <Link to="/studio">build with it</Link>
        <Link to="/create-json">create utils file</Link>
        <Link to="/about">about</Link>
      </div>
    </nav>
  );
}

export default NavBar;
