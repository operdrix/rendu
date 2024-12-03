import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Tous les champs sont requis.");
      return;
    }

    axiosInstance
      .post("/auth/register", { username, email, password })
      .then(() => {
        toast.success("Votre compte a été créé avec succès, veuillez vous connecter.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        toast.error(error.response?.data?.error || "Une erreur s'est produite lors de l'inscription.");
      });
  };

  return (
    <div className="main-bg p-4 flex">
      <div className="flex justify-center items-center h-auto flex-1">
        <div className="card w-96 backdrop-blur-sm bg-white/60">
          <div className="card-body">
            <h2 className="card-title">Inscription au blog</h2>
            <form onSubmit={handleRegister}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nom d'utilisateur</span>
                </label>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  className="input input-bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
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
                  placeholder="Mot de passe"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage