import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../assets/PraktikumAuthor.css";

function PraktikumAuthor() {
  const [praktikums, setPraktikums] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPraktikums, setFilteredPraktikums] = useState([]);
  const navigate = useNavigate();
  const commonImage = "https://wallpapercave.com/wp/wp6711598.jpg";

  useEffect(() => {
    const fetchPraktikums = async () => {
      try {
        const result = await axios.get("http://localhost:3007/praktikums");
        setPraktikums(result.data);
        setFilteredPraktikums(result.data); // Initialize filteredPraktikums with all data
      } catch (error) {
        console.error("Error fetching praktikums:", error);
      }
    };
    fetchPraktikums();
  }, []);

  useEffect(() => {
    const filtered = praktikums.filter((praktikum) =>
      praktikum.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPraktikums(filtered);
  }, [searchTerm, praktikums]);

  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3007/praktikums/${id}`);
      setPraktikums(praktikums.filter((praktikum) => praktikum.id !== id));
      setFilteredPraktikums(
        filteredPraktikums.filter((praktikum) => praktikum.id !== id)
      );
    } catch (error) {
      console.error("Error deleting praktikum:", error);
    }
  };

  const handleEditClick = (id, e) => {
    e.stopPropagation();
    navigate(`/edit-praktikum/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDetailClick = (slug, e) => {
    e.stopPropagation();
    navigate(`/praktikum/${slug}`);
  };

  return (
    <div>
      <NavbarAuthor />
      <div className="PraktikumAuthorBody">
        <SidebarAuthor />
        <div className="PraktikumAuthorContent">
          <div className="PraktikumAuthorSearch-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Link to="/tambah-praktikum">
              <button>Tambah Praktikum</button>
            </Link>
          </div>
          {filteredPraktikums.map((praktikum) => (
            <div
              key={praktikum.id}
              className="PraktikumAuthorCard"
              onClick={(e) => handleDetailClick(praktikum.slug, e)}
            >
              <div className="PraktikumAuthorImage">
                <img src={commonImage} alt={praktikum.title} />
              </div>
              <div className="PraktikumAuthorContentDetails">
                <h3>{praktikum.title}</h3>
                <p className="PraktikumDescription">
                  {stripHtml(praktikum.description).substring(0, 200)}...
                </p>
              </div>
              <div className="PraktikumAuthorEdit">
                <button
                  className="edit-button"
                  onClick={(e) => handleEditClick(praktikum.id, e)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Praktikum
                </button>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(praktikum.id, e)}
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

export default PraktikumAuthor;
