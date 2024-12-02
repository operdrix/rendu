import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();
  console.log(user);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          BlogApp
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link className="btn" to="/">Home</Link>
          </li>
          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <Link className="btn" to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <button className="btn btn-error" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="btn" to="/login">Login</Link>
              </li>
              <li>
                <Link className="btn" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
