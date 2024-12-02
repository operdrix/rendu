import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../services/axiosInstance";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AdminUsersPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    // Récupérer les utilisateurs
    axiosInstance
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        toast.error("Impossible de charger les utilisateurs.");
      });
  }, [user, navigate]);

  // Supprimer un utilisateur
  const handleDeleteUser = async (id: number) => {
    axiosInstance
      .delete(`/users/${id}`)
      .then(() => {
        toast.success("Utilisateur supprimé !");
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        toast.error("Impossible de supprimer l'utilisateur.");
      });
  };

  // Changement du rôle d'un utilisateur
  const handleChangeRole = async (id: number, role: string) => {
    const user = users.find((user) => user.id === id);
    if (!user) {
      console.error("Utilisateur non trouvé.");
      toast.error("Utilisateur non trouvé.");
      return;
    }
    user.role = role;
    try {
      const response = await axiosInstance.put(`/users/${id}`, user);
      toast.success("Rôle mis à jour !");
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      toast.error("Impossible de mettre à jour le rôle.");
    }
  }

  return (
    <div className="p-4 flex mt-7">
      <div className="man-bg container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Administration du Blog (Réservé aux administrateurs)</h1>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Gestion des Utilisateurs</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {users && users.length > 0 ? (
              users.map((user) => (
                <li key={user.id} className="border p-4 rounded shadow flex flex-col gap-3">
                  <p>
                    <strong>{user.username}</strong>
                  </p>
                  <p>Email : {user.email}</p>
                  <div className="flex items-center gap-2">
                    <p>Rôle :</p>
                    <select
                      className="select select-bordered"
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    >
                      <option value="user" selected={user.role === "user"}>
                        Utilisateur
                      </option>
                      <option value="admin" selected={user.role === "admin"}>
                        Administrateur
                      </option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn btn-error mt-4"
                  >
                    Supprimer
                  </button>
                </li>
              ))
            ) : (
              <p>Aucun utilisateur disponible.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminUsersPage;
