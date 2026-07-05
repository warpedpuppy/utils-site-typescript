import NavBar from "../components/NavBar/NavBar";
import { Link, Outlet } from "react-router-dom";
import {
  CORE_LICENSE,
  CORE_PACKAGE_NAME,
  CORE_VERSION,
  GITHUB_URL,
  NPM_URL,
} from "../packageMeta";

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
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
            {CORE_PACKAGE_NAME} v{CORE_VERSION}
          </a>
          <span aria-hidden="true"> · </span>
          {CORE_LICENSE} license
          <span aria-hidden="true"> · </span>© {new Date().getFullYear()} Warped
          Puppy LLC
        </div>
      </footer>
    </div>
  );
}

export default OuterShell;
