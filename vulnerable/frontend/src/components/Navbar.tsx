import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <div className="navbar bg-base-100 shadow-lg h-20">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          BlogApp
        </Link>
        <div className="badge badge-warning gap-2">

          Vulnérable
        </div>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link className="" to="/">Accueil</Link>
          </li>
          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <details>
                    <summary>Adminitration</summary>
                    <ul className="bg-base-100 rounded-t-none p-2">
                      <li>
                        <Link className="" to="/admin/articles">Articles</Link>
                      </li>
                      <li>
                        <Link className="" to="/admin/users">Utilisateurs</Link>
                      </li>
                    </ul>
                  </details>
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
                <Link className="" to="/login">Connexion</Link>
              </li>
              <li>
                <Link className="" to="/register">Inscription</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
