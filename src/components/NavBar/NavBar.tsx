import "./NavBar.scss";
import { Link } from "react-router-dom";
function NavBar() {
  return (
    <nav>
      <div>nav</div>
      <Link to="/">home</Link>
      <Link to="/examples">examples</Link>
      <Link to="/about">about</Link>
    </nav>
  );
}

export default NavBar;
