import axios from "axios";

// Crée une instance d'axios avec une configuration par défaut
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:4001/api", // L'URL de ton backend (ajuste si nécessaire)
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute un intercepteur de requête pour ajouter un token d'authentification (si nécessaire)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Récupère le token depuis le localStorage (ou autre stockage)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gère les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Gère le cas où l'utilisateur n'est pas autorisé (ex. token expiré)
      console.error("Unauthorized, please login again.");
      // Redirige vers la page de login ou fais une autre action
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
