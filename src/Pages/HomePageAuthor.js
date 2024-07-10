import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";
import "../assets/HomePageAuthor.css";

function HomePageAuthor() {
  const [newArticles, setNewArticles] = useState([]);

  useEffect(() => {
    const fetchNewArticles = async () => {
      try {
        const result = await axios.get("http://localhost:5000/new-articles");
        setNewArticles(result.data);
      } catch (error) {
        console.error("Error fetching new articles:", error);
      }
    };
    fetchNewArticles();
  }, []);

  const slugify = (title) => {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
  };

  return (
    <div className="HomePageAuthor">
      <NavbarAuthor />
      <div className="HomePageAuthor-body">
        <SidebarAuthor />
        <div className="HomePageAuthor-content">
          <h1>Materi yang baru ditambahkan:</h1>
          <div className="HomePageAuthor-new-articles">
            {newArticles.map((article) => (
              <Link
                to={`/materi/${slugify(article.title)}`}
                key={article.id}
                className="HomePageAuthor-article-link"
              >
                <div className="HomePageAuthor-article-card">
                  <img
                    src="https://wallpapercave.com/wp/wp6711598.jpg"
                    alt={article.title}
                    className="HomePageAuthor-article-image"
                  />
                  <h2>{article.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageAuthor;
