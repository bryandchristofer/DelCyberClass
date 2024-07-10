import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/MaterialDetail.css";

function MateriDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/articles`);
        const foundArticle = result.data.find(
          (article) => slugify(article.title) === slug
        );
        setArticle(foundArticle);
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      }
    };
    fetchArticle();
  }, [slug]);

  const slugify = (title) => {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
  };

  if (!article) {
    return <div>Article not found.</div>;
  }

  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div>
      <Navbar />
      <div className="MateriBody">
        <Sidebar />
        <div className="article-container">
          <h1>{article.title}</h1>
          {/* Jika artikel memiliki gambar, tampilkan di sini */}
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="article-image"
            />
          )}
          <div dangerouslySetInnerHTML={createMarkup(article.description)} />
          <div className="author-info">Written by: {article.author}</div>
        </div>
      </div>
    </div>
  );
}

export default MateriDetail;
