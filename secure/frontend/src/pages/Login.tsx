import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import axiosInstance from "../services/axiosInstance";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email et mot de passe sont requis.");
      return;
    }

    axiosInstance
      .post("/auth/login", { email, password })
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Vous êtes connecté.");
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        toast.error(error.response?.data?.error || "Une erreur s'est produite lors de la connexion.");
      });
  };

  return (
    <div className="main-bg p-4 flex">
      <div className="flex justify-center items-center h-auto flex-1">
        <div className="card w-96 backdrop-blur-sm bg-white/60">
          <div className="card-body">
            <h2 className="card-title">Connexion au blog</h2>
            <form onSubmit={handleLogin}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Mot de passe</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
