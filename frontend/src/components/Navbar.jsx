import { Link, useLocation } from "react-router-dom";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? "is-active" : ""}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Marginalia
        </Link>
        <nav className="navbar__links">
          <NavLink to="/">Posts</NavLink>
          <NavLink to="/posts/new">Write</NavLink>
          <NavLink to="/login">Log in</NavLink>
          <NavLink to="/register">Sign up</NavLink>
        </nav>
      </div>
    </header>
  );
}
