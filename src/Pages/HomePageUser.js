import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/HomePageUser.css";

function HomePageUser() {
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        const result = await axios.get("http://localhost:5000/recent-articles");
        setRecentArticles(result.data);
      } catch (error) {
        console.error("Error fetching recent articles:", error);
      }
    };
    fetchRecentArticles();
  }, []);

  const slugify = (title) => {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
  };

  return (
    <div className="HomePageUser">
      <Navbar />
      <div className="HomePageUser-body">
        <Sidebar />
        <div className="HomePageUser-content">
          <h1>Materi yang baru diakses:</h1>
          <div className="HomePageUser-recent-articles">
            {recentArticles.map((article) => (
              <Link
                to={`/materi/${slugify(article.title)}`}
                key={article.id}
                className="HomePageUser-article-link"
              >
                <div className="HomePageUser-article-card">
                  <img
                    src="https://wallpapercave.com/wp/wp6711598.jpg"
                    alt={article.title}
                    className="HomePageUser-article-image"
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

export default HomePageUser;
