import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axiosInstance.get(`/articles/${id}`)
      .then((response) => setArticle(response.data))
      .catch((error) => console.error("Error fetching article:", error));
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(`/articles/${id}/comments`, { content: comment })
      .then(() => setComment(""))
      .catch((error) => console.error("Error posting comment:", error));
  };

  return article ? (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default ArticlePage