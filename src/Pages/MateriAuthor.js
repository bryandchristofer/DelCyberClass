import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../assets/MateriAuthor.css";

function MateriAuthor() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const commonImage = "https://wallpapercave.com/wp/wp6711598.jpg";

  useEffect(() => {
    const fetchArticles = async () => {
      const result = await axios.get("http://localhost:5000/articles");
      setArticles(result.data);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    setFilteredMateri(articles);
  }, [articles]);

  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const slugify = (title) => {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/articles/${id}`);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleEditClick = (id, e) => {
    e.stopPropagation();
    navigate(`/edit-materi/${id}`);
  };

  const [searchItem, setSearchItem] = useState("");
  const [filteredMateri, setFilteredMateri] = useState(articles);
  const handleInputChange = (e) => {
    const searchmateri = e.target.value;
    setSearchItem(searchmateri);
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchmateri.toLowerCase())
    );
    setFilteredMateri(filtered);
  };
  
  return (
    <div>
      <NavbarAuthor />
      <div className="MateriAuthorBody">
        <SidebarAuthor />
        <div className="MateriAuthorContent">
          <div className="MateriAuthorSearch-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchItem}
              onChange={handleInputChange}
            />
            <Link to="/tambah-materi">
              <button>Tambah Kelas</button>
            </Link>
          </div>
          {filteredMateri.map((article, index) => (
            <div
              key={index}
              className="MateriAuthorCard"
              onClick={() => navigate(`/materi/${slugify(article.title)}`)}
            >
              <div className="MateriAuthorImage">
                <img src={commonImage} alt={article.title} />
              </div>
              <div className="MateriAuthorContentDetails">
                <h3>{article.title}</h3>
                <p className="description">
                  {stripHtml(article.description).substring(0, 200)}...
                </p>
                <p className="instructor">Instructor: {article.author}</p>
              </div>
              <div className="MateriAuthorEdit">
                <button
                  className="edit-button"
                  onClick={(e) => handleEditClick(article.id, e)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Materi
                </button>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(article.id, e)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MateriAuthor;
