import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance.get("/articles")
      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching articles.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any) => (
          <div
            key={article.id}
            className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link to={`/article/${article.id}`}>
              <h2 className="text-2xl font-semibold">{article.title}</h2>
            </Link>
            <p className="text-gray-600 mt-2">{article.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage