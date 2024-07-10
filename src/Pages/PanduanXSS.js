import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/PanduanXSS.css";

const PanduanXSS = () => {
  return (
    <div className="HomePageUser">
      <Navbar />
      <div className="HomePageUser-body">
        <Sidebar />
        <div className="panduan">
          <h1>Panduan Melakukan Praktikum Cross-Site Scripting (XSS)</h1>
          <p>
            Selamat datang di panduan praktikum XSS. Praktikum ini bertujuan
            untuk memberikan pengalaman praktis dalam mengidentifikasi dan
            mengeksploitasi kerentanan XSS dalam aplikasi web secara etis.
          </p>

          <h2>Tujuan Pembelajaran:</h2>
          <ul>
            <li>-Mengenali berbagai jenis serangan XSS.</li>
            <li>-Memahami dampak dari serangan XSS.</li>
          </ul>

          <h2>Instruksi Praktikum:</h2>
          <ol>
            <li>
              1. Mulai dengan mempelajari teori dasar XSS dari modul yang
              disediakan.
            </li>
            <li>
              2. Buka halaman untuk melakukan{" "}
              <a href="http://localhost:3000/xss">praktikum XSS</a> yang
              tersedia untuk memulai.{" "}
            </li>
            <li>
              3. Gunakan form input komentar pada halaman untuk menyisipkan
              payload XSS yang aman.
            </li>
            <li>
              4. Amati bagaimana aplikasi bereaksi terhadap input berbahaya.
            </li>
          </ol>

          <h2>Contoh Serangan XSS yang Aman untuk Dicoba</h2>
          <p>
            Berikut beberapa payload yang bisa Anda gunakan untuk menguji
            kerentanan XSS. Ingat, gunakan ini hanya dalam lingkungan praktikum
            yang aman.
          </p>
          <code>
            &lt;img src="x" onerror="document.body.innerHTML += ' &lt;p&gt;XSS
            executed!&lt;/p&gt;';"&gt;
            <br />
            &lt;img src="invalid" onerror="document.body.style.backgroundColor =
            'lightblue';"&gt;
            <br />
            &lt;img src="x" onerror="window.location =
            'https://google.com';"&gt;
          </code>

          <p>
            <strong>Catatan:</strong> Selalu praktikkan etika keamanan siber.
            Jangan mencoba serangan ini pada situs web yang bukan bagian dari
            praktikum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanduanXSS;
