import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../assets/Navbar.css";

function NavbarAuthor() {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // use navigate('/path') instead of history.push('/path')
  };

  return (
    <header className="Navbar">
      <a href="/author" className="Navbar-logo">
        DelCyberClass
      </a>
      <div className="Navbar-profile" onClick={handleProfileClick}>
        <FontAwesomeIcon icon={faUser} />
        {showLogout && (
          <button className="Logout-button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default NavbarAuthor;
