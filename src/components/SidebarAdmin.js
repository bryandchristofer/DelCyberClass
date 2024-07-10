import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/SidebarAdmin.css";

function SidebarAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`SidebarAdmin ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isCollapsed ? (
          <i className="fas fa-chevron-right"></i>
        ) : (
          <i className="fas fa-chevron-left"></i>
        )}
      </button>
      <ul className="SidebarAdmin-nav">
        <a href="/admin">
          <li className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
            <span className="icon">🏠</span>
            <span className="text">Dashboard</span>
          </li>
        </a>
        <a href="/tambah-pengajar">
          <li
            className={`nav-item ${
              isActive("/tambah-pengajar") ? "active" : ""
            }`}
          >
            <span className="icon">👨‍🏫</span> {/* Changed icon */}
            <span className="text">Tambah Pengajar</span>
          </li>
        </a>
      </ul>
    </aside>
  );
}

export default SidebarAdmin;
