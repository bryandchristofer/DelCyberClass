import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/SidebarAuthor.css";

function SidebarAuthor() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`SidebarAuthor ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isCollapsed ? (
          <i className="fas fa-chevron-right"></i>
        ) : (
          <i className="fas fa-chevron-left"></i>
        )}
      </button>
      <ul className="SidebarAuthor-nav">
        <a href="/author">
          <li className={`nav-item ${isActive("/author") ? "active" : ""}`}>
            <span className="icon">🏠</span>
            <span className="text">Dashboard</span>
          </li>
        </a>
        <a href="/materi-author">
          <li
            className={`nav-item ${isActive("/materi-author") ? "active" : ""}`}
          >
            <span className="icon">📚</span>
            <span className="text">Materi</span>
          </li>
        </a>
        <a href="/praktikum-author">
          <li
            className={`nav-item ${
              isActive("/praktikum-author") ? "active" : ""
            }`}
          >
            <span className="icon">🔬</span>
            <span className="text">Praktikum</span>
          </li>
        </a>
      </ul>
    </aside>
  );
}

export default SidebarAuthor;
