import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/XSS.css";

function XSS() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3002/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script: input }),
      });
      const data = await response.json();
      console.log(data);
      setOutput(input); // Sementara kita tetap menampilkan input untuk demonstrasi
    } catch (error) {
      console.error("Error submitting script:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="XSSBody">
        <Sidebar />
        <div className="XSS">
          <header className="XSS-header">
            <h1>Cross-Site Scripting (XSS)</h1>
            <article className="xss-article">
              <h2>Understanding Cross-Site Scripting (XSS)</h2>
              <p>
                Cross-Site Scripting (XSS) adalah sebuah serangan keamanan web
                dimana penyerang dapat menyisipkan skrip jahat ke dalam
                halaman-halaman yang ditampilkan kepada pengguna lain. Ini
                memungkinkan penyerang untuk menjalankan skrip di browser
                pengguna tanpa sepengetahuannya, yang bisa digunakan untuk
                berbagai tujuan jahat, termasuk pencurian informasi sensitif,
                seperti token otentikasi atau detail kartu kredit.
              </p>
              <p>
                XSS umumnya terjadi ketika aplikasi web mengambil data dari
                pengguna dan menampilkannya pada halaman web tanpa sanitasi atau
                escape yang memadai. Ini bisa berbentuk pesan di forum, komentar
                pada blog, atau input pengguna lainnya yang tidak diproses
                dengan benar oleh aplikasi web.
              </p>
              <p>
                Ada tiga jenis utama serangan XSS:
                <ul>
                  <li>
                    <strong>Reflected XSS</strong>: Terjadi ketika aplikasi
                    menerima input dari pengguna dan segera menampilkannya
                    kembali. Skrip jahat dikirim melalui permintaan HTTP dan
                    dieksekusi di browser korban saat respons ditampilkan.
                  </li>
                  <li>
                    <strong>Stored XSS</strong>: Lebih berbahaya karena skrip
                    jahat disimpan di server, seperti dalam database, dan
                    kemudian ditampilkan kepada setiap pengguna yang mengakses
                    halaman terkait.
                  </li>
                  <li>
                    <strong>DOM-based XSS</strong>: Terjadi ketika skrip jahat
                    memodifikasi DOM (Document Object Model) di sisi klien dan
                    dijalankan sebagai hasil dari modifikasi DOM tersebut tanpa
                    harus mendapatkan respons dari server.
                  </li>
                </ul>
              </p>
              <p>
                Pencegahan XSS melibatkan serangkaian praktik pengembangan yang
                aman, termasuk sanitasi dan escape dari input pengguna sebelum
                ditampilkan kembali di halaman, implementasi kebijakan Content
                Security Policy (CSP) yang ketat, dan validasi input yang aman.
                Edukasi dan kesadaran juga berperan penting dalam meminimalisir
                risiko serangan ini.
              </p>
              <p>
                Dengan memahami bagaimana XSS bekerja dan menerapkan
                langkah-langkah keamanan yang tepat, pengembang dapat melindungi
                aplikasi dan penggunanya dari serangan-serangan yang berpotensi
                merugikan ini.
              </p>
            </article>
            <form onSubmit={handleSubmit} className="xss-comment-form">
              <label htmlFor="xssInput">Tambahkan komentar Anda:</label>
              <textarea
                id="xssInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Masukkan komentar..."
              ></textarea>
              <button type="submit">Submit</button>
            </form>
            <div dangerouslySetInnerHTML={{ __html: output }} />
          </header>
        </div>
      </div>
    </div>
  );
}

export default XSS;
