import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../services/axiosInstance";

type Article = {
  id: string;
  title: string;
  content: string;
  author_id?: number;
  comments: { id: string; content: string; user_id: number }[];
}

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AdminArticlesPage = () => {
  const { user } = useUser();
  const quillRef = useRef<ReactQuill>(null);
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    // Récupérer les articles et leurs commentaires
    const fetchArticles = async () => {
      try {
        const articlesResponse = await axiosInstance.get("/articles");
        setArticles(articlesResponse.data);

        // appel de la route /articles/:id/comments pour récupérer les commentaires
        const articlesWithComments = await Promise.all(
          articlesResponse.data.map(async (article: Article) => {
            const commentsResponse = await axiosInstance.get(`/articles/${article.id}/comments`);
            return { ...article, comments: commentsResponse.data };
          })
        );

        setArticles(articlesWithComments);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        toast.error("Impossible de charger les articles.");
      }
    }
    fetchArticles();

    // Récupérer les utilisateurs
    axiosInstance
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        toast.error("Impossible de charger les utilisateurs.");
      });
  }, [user, navigate]);

  // Ajouter ou éditer un article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Le titre et le contenu de l'article sont obligatoires.");
      return;
    }

    if (editingArticle) {
      // Mise à jour d'un article existant
      const newArticle = {
        title,
        content,
        author_id: user ? user.id : undefined,
      };

      try {
        await axiosInstance.put(`/articles/${editingArticle.id}`, newArticle);
        toast.success("Article mis à jour !");
        setArticles(
          articles.map((article) =>
            article.id === editingArticle.id ? { ...article, ...newArticle } : article
          )
        );
        setEditingArticle(null);
        setTitle("");
        setContent("");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article :", error);
        toast.error("Impossible de mettre à jour l'article.");
      }

    } else {
      // Ajout d'un nouvel article
      const newArticle = {
        title,
        content,
        author_id: user ? user.id : undefined,
      };

      try {
        const response = await axiosInstance.post("/articles", newArticle);
        toast.success("Article ajouté !");
        setArticles([...articles, { ...newArticle, id: response.data.id, comments: [] }]);
        setTitle("");
        setContent("");
        if (quillRef.current) {
          quillRef.current.getEditor().root.innerHTML = "";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'article :", error);
        toast.error("Impossible d'ajouter l'article.");
      }

    }
  };

  // Préparer l'édition d'un article
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
  };

  // Annuler l'édition d'un article
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setTitle("");
    setContent("");
  };

  // Supprimer un article
  const handleDeleteArticle = (id: string) => {
    axiosInstance
      .delete(`/articles/${id}`)
      .then(() => {
        toast.success("Article supprimé !");
        setArticles(articles.filter((article) => article.id !== id));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'article :", error);
        toast.error("Impossible de supprimer l'article.");
      });
  };

  // Supprimer un commentaire
  const handleDeleteComment = (commentId: string, articleId: string) => {
    axiosInstance
      .delete(`/comments/${commentId}`)
      .then(() => {
        toast.success("Commentaire supprimé !");
        setArticles(
          articles.map((article) =>
            article.id === articleId
              ? { ...article, comments: article.comments.filter((comment) => comment.id !== commentId) }
              : article
          )
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du commentaire :", error);
        toast.error("Impossible de supprimer le commentaire.");
      });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "link",
    "image",
  ];

  return (
    <div className="p-4 flex mt-7">
      <div className="man-bg container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Administration du Blog (Réservé aux administrateurs)</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Gestion des Articles</h2>
          <form onSubmit={handleSaveArticle} className="mb-8">
            <div className="form-control mb-4">
              <label className="label">Titre</label>
              <input
                type="text"
                className="input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Contenu de l'article</label>
              <ReactQuill
                theme="snow"
                ref={quillRef}
                value={content}
                onChange={(value) => setContent(value)}
                modules={modules}
                formats={formats}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingArticle ? "Sauvegarder les modifications" : "Publier l'article"}
            </button>
            {editingArticle && (
              <button onClick={handleCancelEdit} className="btn btn-error ml-4">
                Annuler
              </button>
            )}
          </form>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <li
                  key={article.id}
                  className="border p-4 rounded shadow-md"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-2">
                      {/* Edition de l'article */}
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="btn btn-sm btn-warning"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>

                      </button>
                      {/* Suppression de l'article */}
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="btn btn-sm btn-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                      {/* Voir l'article */}
                      <button
                        onClick={() => navigate(`/article/${article.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                      </button>
                    </div>
                    <p className="text-info">Par {users.find((u) => u.id === article.author_id)?.username}</p>
                  </div>
                  <h3 className="text-xl font-bold">{article.title}</h3>
                  <p dangerouslySetInnerHTML={{
                    __html: `${article.content.substring(0, 100)}...`
                  }}></p>
                  <h4 className="text-lg font-semibold mt-4">
                    Commentaires ({article.comments?.length})
                  </h4>
                  <ul className="space-y-2">
                    {article.comments &&
                      article.comments.map((comment) => (
                        <li key={comment.id} className="border p-2 rounded bg-gray-100 flex justify-between">
                          <div>
                            <p className="text-info">
                              Par {users.find((u) => Number(u.id) === Number(comment.user_id))?.username}
                            </p>
                            <p>{comment.content}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(comment.id, article.id)}
                            className="btn btn-sm btn-error ml-4"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                          </button>
                        </li>
                      ))}
                  </ul>
                </li>
              ))
            ) : (
              <p>Aucun article disponible.</p>
            )}
          </ul>
        </section>

      </div>
    </div>
  );
};

export default AdminArticlesPage;
