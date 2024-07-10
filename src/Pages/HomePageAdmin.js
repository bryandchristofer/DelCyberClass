import React from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import "../assets/HomePageAdmin.css";

function HomePageAdmin() {
  return (
    <div className="HomePageAdmin">
      <NavbarAdmin />
      <div className="HomePageAdmin-body">
        <SidebarAdmin />
        <div className="HomePageAdmin-content">
          <h1>Welcome, Admin!</h1>
        </div>
      </div>
    </div>
  );
}

export default HomePageAdmin;
