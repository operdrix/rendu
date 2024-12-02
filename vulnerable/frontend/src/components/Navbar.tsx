import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();
  console.log(user);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          BlogApp
        </Link>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link className="" to="/">Home</Link>
          </li>
          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <Link className="" to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <details>
                  <summary>Bonjour {user.username} (role {user.role})</summary>
                  <ul className="bg-base-100 rounded-t-none p-2">
                    <li><button className="btn btn-error btn-sm" onClick={logout}>
                      Logout
                    </button></li>

                  </ul>
                </details>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="" to="/login">Login</Link>
              </li>
              <li>
                <Link className="" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
