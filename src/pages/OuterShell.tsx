import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
function OuterShell() {
  return (
    <>
      <NavBar />
      <Outlet />
      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '24px' }}>
        © {new Date().getFullYear()} Warped Puppy LLC
      </footer>
    </>
  );
}

export default OuterShell;
