import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/Sidebar.css";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`Sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isCollapsed ? (
          <i className="fas fa-chevron-right"></i>
        ) : (
          <i className="fas fa-chevron-left"></i>
        )}
      </button>
      <ul className="Sidebar-nav">
        <a href="/beranda">
          <li className={`nav-item ${isActive("/beranda") ? "active" : ""}`}>
            <span className="icon">🏠</span>
            <span className="text">Dashboard</span>
          </li>
        </a>
        <a href="/materi">
          <li className={`nav-item ${isActive("/materi") ? "active" : ""}`}>
            <span className="icon">📚</span>
            <span className="text">Materi</span>
          </li>
        </a>
        <a href="/praktikum">
          <li className={`nav-item ${isActive("/praktikum") ? "active" : ""}`}>
            <span className="icon">🔬</span>
            <span className="text">Praktikum</span>
          </li>
        </a>
      </ul>
    </aside>
  );
}

export default Sidebar;
