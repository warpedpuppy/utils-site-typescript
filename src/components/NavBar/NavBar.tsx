import "./NavBar.scss";
import { Link } from "react-router-dom";
function NavBar() {
  return (
    <nav>
      <h1>nav</h1>
      <div>
        <Link to="/">home</Link>
        <Link to="/examples">examples</Link>
        <Link to="/about">about</Link>
      </div>
    </nav>
  );
}

export default NavBar;
