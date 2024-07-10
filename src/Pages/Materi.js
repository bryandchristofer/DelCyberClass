import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MateriCard from "../CRUD Materi/MateriCard";
import "../assets/Materi.css";

function Materi() {
  const [articles, setArticles] = useState([]);
  const commonImage = "https://wallpapercave.com/wp/wp6711598.jpg";

  useEffect(() => {
    const fetchArticles = async () => {
      const result = await axios.get("http://localhost:5000/articles");
      setArticles(result.data);
    };
    fetchArticles();
  }, []);

  const slugify = (title) => {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
  };

  return (
    <div>
      <Navbar />
      <div className="MateriBody">
        <Sidebar />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {articles.map((article, index) => (
            <Link
              to={`/materi/${slugify(article.title)}`}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <MateriCard
                title={article.title}
                description={article.description}
                author={article.author}
                image={commonImage}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Materi;
