import React, { useState } from "react";
import axios from "axios";
import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import "../assets/TambahPengajar.css";

function TambahPengajar() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "author", // Default role to 'author'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/admin/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        }
      );
      alert("Pengajar baru berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding author:", error.response.data);
      alert("Gagal mendaftarkan pengajar baru.");
    }
  };

  return (
    <>
      <div>
        <NavbarAdmin />
        <div className="TambahPengajarBody">
          <SidebarAdmin />
          <div className="container">
            <form onSubmit={handleSubmit} className="add-author-form">
              <h2 className="form-title">Tambah Pengajar</h2>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit">Tambah Pengajar</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default TambahPengajar;
