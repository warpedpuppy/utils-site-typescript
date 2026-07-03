import NavBar from "../components/NavBar/NavBar";
import { Outlet, useLocation } from "react-router-dom";
function OuterShell() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname === "/" ||
    pathname.startsWith("/examples") ||
    pathname.startsWith("/studio");

  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Outlet />
      </main>
      {!hideFooter && (
        <footer className="site-footer">
          © {new Date().getFullYear()} Warped Puppy LLC
        </footer>
      )}
    </div>
  );
}

export default OuterShell;
