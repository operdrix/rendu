import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import axiosInstance from "../services/axiosInstance";

type Article = {
  id: string;
  title: string;
  content: string;
  author_id: number;
}

type Comment = {
  id: string;
  content: string;
  user_id: number;
  created_at?: string;
}

type User = {
  id: number;
  username: string;
}

const ArticlePage = () => {
  const { id } = useParams(); // ID de l'article depuis l'URL
  const navigate = useNavigate();
  const { user } = useUser(); // Contexte utilisateur

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Récupérer les détails de l'article
    axiosInstance
      .get(`/articles/${id}`)
      .then((response) => setArticle(response.data))
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'article :", error);
        toast.error("Impossible de charger l'article.");
        return navigate("/not-found");
      });

    // Récupérer les utilisateurs
    axiosInstance
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        toast.error("Impossible de charger les utilisateurs.");
      });

    // Récupérer les commentaires de l'article
    axiosInstance
      .get(`/articles/${id}/comments`)
      .then((response) => {
        setComments(response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commentaires :", error);
        toast.error("Impossible de charger les commentaires.");
      });

  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    // Envoyer le nouveau commentaire
    axiosInstance
      .post(`/articles/${id}/comments`, {
        content: newComment,
        user_id: user.id,
      })
      .then((response) => {
        toast.success("Commentaire ajouté !");
        setComments([...comments, {
          id: response.data.id,
          content: newComment,
          user_id: Number(user.id),
        }]);
        setNewComment(""); // Réinitialiser le champ
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        toast.error("Impossible d'ajouter le commentaire.");
      });
  };

  if (!article) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="main-bg p-4 flex">
      <div className="container mx-auto px-4 mt-7">
        <div className="mb-8 backdrop-blur-sm bg-white/60 p-3 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <p className="text-gray-500 text-sm mb-6">Par : {
            users.find((u) => Number(u.id) === Number(article.author_id))?.username || "Utilisateur inconnu"
          }</p>
          <p className="text-lg article-content" dangerouslySetInnerHTML={{ __html: article.content }}></p>
        </div>

        <h2 className="text-2xl font-semibold mb-8">Commentaires</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="mb-8">
            {comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="border rounded-lg p-4 bg-base-100 shadow-md">
                    <p dangerouslySetInnerHTML={{ __html: comment.content }}></p>
                    <p className="text-sm text-gray-500 mt-2">
                      Par : {
                        users.find((u) => Number(u.id) === Number(comment.user_id))?.username || "Utilisateur inconnu"
                      }
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun commentaire pour le moment.</p>
            )}
          </div>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-2 max-h-60">
              <textarea
                className="textarea textarea-bordered w-full mb-4 min-h-28"
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}

              />
              <button type="submit" className="btn btn-primary">
                Poster
              </button>
            </form>
          ) : (
            <div className="alert alert-info">
              <p>Veuillez <a href="/login" className="underline">vous connecter</a> pour commenter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticlePage