import "./NavBar.scss";
import { Link } from "react-router-dom";
function NavBar() {
  return (
    <nav>
      <Link to="/">
        <h1>utilspalooza</h1>
      </Link>
      <div>
        <Link to="/">home</Link>
        <Link to="/examples">examples</Link>
        <Link to="/create-json">create json</Link>
        <Link to="/about">about</Link>
      </div>
    </nav>
  );
}

export default NavBar;
