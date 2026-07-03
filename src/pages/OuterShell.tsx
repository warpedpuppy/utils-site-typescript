import NavBar from "../components/NavBar/NavBar";
import { Link, Outlet } from "react-router-dom";

const GITHUB_URL = "https://github.com/warpedpuppy/utils-site-typescript";
const NPM_URL = "https://www.npmjs.com/package/@utilspalooza/core";

function OuterShell() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <nav className="site-footer__links" aria-label="Footer">
          <Link to="/about">About</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
            npm
          </a>
        </nav>
        <div className="site-footer__legal">
          © {new Date().getFullYear()} Warped Puppy LLC
        </div>
      </footer>
    </div>
  );
}

export default OuterShell;
