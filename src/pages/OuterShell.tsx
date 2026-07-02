import NavBar from "../components/NavBar/NavBar";
import { Outlet, useLocation } from "react-router-dom";
function OuterShell() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname === "/" ||
    pathname.startsWith("/examples") ||
    pathname.startsWith("/studio");

  return (
    <>
      <NavBar />
      <Outlet />
      {!hideFooter && (
        <footer style={{ textAlign: 'center', padding: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '24px' }}>
          © {new Date().getFullYear()} Warped Puppy LLC
        </footer>
      )}
    </>
  );
}

export default OuterShell;
