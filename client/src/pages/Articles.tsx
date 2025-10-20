import ArticleCard, { ArticleCardProps } from "@/components/ArticleCard";
import { useEffect, useState } from "react";

export default function Articles() {
  const [articles, setArticles] = useState<ArticleCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load articles from posts-db.json
    const loadArticles = async () => {
      try {
        const response = await fetch("/posts-db.json");
        if (response.ok) {
          const data = await response.json();
          setArticles(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to load articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            All Articles
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore all my travel stories, insights, and discoveries from around the world.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider" />
      </div>

      {/* Articles Grid */}
      <section className="container py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
              <p className="mt-4 text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

