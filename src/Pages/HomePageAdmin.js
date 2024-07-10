import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import "../assets/HomePageAdmin.css";

function HomePageAdmin() {
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
    <div className="HomePageAdmin">
      <NavbarAdmin />
      <div className="HomePageAdmin-body">
        <SidebarAdmin />
        <div className="HomePageAdmin-content">
          <h1>Materi yang baru ditambahkan:</h1>
          <div className="HomePageAdmin-new-articles">
            {newArticles.map((article) => (
              <Link
                to={`/materi/${slugify(article.title)}`}
                key={article.id}
                className="HomePageAdmin-article-link"
              >
                <div className="HomePageAdmin-article-card">
                  <img
                    src="https://wallpapercave.com/wp/wp6711598.jpg"
                    alt={article.title}
                    className="HomePageAdmin-article-image"
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

export default HomePageAdmin;
