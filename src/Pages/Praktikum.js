import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/Praktikum.css";

function Praktikum() {
  const [praktikums, setPraktikums] = useState([]); // State to store the praktikums

  useEffect(() => {
    async function fetchPraktikums() {
      try {
        const response = await axios.get("http://localhost:3007/praktikums");
        setPraktikums(response.data); // Set fetched praktikums to state
      } catch (error) {
        console.error("Error fetching praktikums:", error);
      }
    }
    fetchPraktikums();
  }, []);

  const imageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLqilcj6gyMyUYkK_inaOCiwHnDlg2xWEIvw&s";

  return (
    <div className="HomePageUser">
      <Navbar />
      <div className="HomePageUser-body">
        <Sidebar />
        {/* Static content for Cross-Site Scripting */}
        <Link to="/panduan-xss" className="praktikum-user-card">
          <div className="praktikum-user-image">
            <img src={imageUrl} alt="Cross-Site Scripting" />
          </div>
          <div className="praktikum-user-content">
            <h3>Cross-Site Scripting</h3>
            <p className="praktikum-user-description">
              Praktikum Cross-Site Scripting (XSS) merupakan sebuah kegiatan
              pembelajaran yang bertujuan untuk mengenalkan dan mendalami teknik
              serangan XSS, di mana kode berbahaya diinjeksikan ke dalam halaman
              web sehingga dapat dieksekusi oleh browser pengguna lain.
            </p>
            <p className="praktikum-user-instructor">Instruktur: </p>
          </div>
        </Link>
        {/* Static content for File Stealing */}
        <Link to="/file-stealing" className="praktikum-user-card">
          <div className="praktikum-user-image">
            <img src={imageUrl} alt="File Stealing" />
          </div>
          <div className="praktikum-user-content">
            <h3>File Stealing</h3>
            <p className="praktikum-user-description">
              Peserta akan belajar berbagai metode serangan yang bisa digunakan
              untuk mengakses, menyalin, atau memindahkan file dari satu sistem
              ke sistem lain tanpa izin. Tujuannya adalah untuk meningkatkan
              pemahaman tentang risiko keamanan yang terkait dengan pengelolaan
              file dan data...
            </p>
            <p className="praktikum-user-instructor">Instruktur: </p>
          </div>
        </Link>
        {/* Dynamic content for additional praktikums */}
        {praktikums.map((praktikum) => (
          <Link
            to={`/praktikum/${praktikum.slug}`}
            className="praktikum-user-card"
            key={praktikum.id}
          >
            <div className="praktikum-user-image">
              <img src={praktikum.imageUrl || imageUrl} alt={praktikum.title} />
            </div>
            <div className="praktikum-user-content">
              <h3>{praktikum.title}</h3>
              <p className="praktikum-user-description">
                {praktikum.description}
              </p>
              <p className="praktikum-user-instructor">
                Instruktur: {praktikum.instructor || "TBA"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Praktikum;
