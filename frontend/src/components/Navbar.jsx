import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? "is-active" : ""}>
      {children}
    </Link>
  );
}

export default function Navbar({ accessToken, setAccessToken }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    setAccessToken(null);
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Marginalia
        </Link>

        <nav className="navbar__links">
          {accessToken ? (
            <>
              <NavLink to="/">Posts</NavLink>
              <NavLink to="/posts/new">Write</NavLink>

              <Link
                to="/profile"
                className="icon-btn"
                aria-label="Profile"
                title="Profile"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>

              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
