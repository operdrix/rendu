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
    <div className="main-bg p-4 flex">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold my-8">Les derniers articles</h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {articles.map((article: any) => (

            <div
              key={article.id}
              className="card bg-base-100 min-w-96 backdrop-blur-sm bg-white/60 max-w-md"
            >
              <div className="card-body">
                <h2 className="card-title">{article.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: `${article.content.substring(0, 100)}...` }}></p>
                <div className="card-actions justify-end">
                  <Link to={`/article/${article.id}`} className="btn btn-primary">Lire</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage