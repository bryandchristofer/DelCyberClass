const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tambahkan ekstensi
  },
});

const upload = multer({ storage: storage });

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "materi-siber",
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Fungsi untuk membuat slug dari judul
const slugify = (title) => {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
};

// Endpoint untuk meng-upload file
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res
      .status(201)
      .send({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
  } else {
    res.status(500).send("No file uploaded.");
  }
});

// Endpoint untuk menyimpan artikel baru
app.post("/articles", (req, res) => {
  const { title, description, author } = req.body;
  const slug = slugify(title);
  const query =
    "INSERT INTO articles (title, description, author, slug) VALUES (?, ?, ?, ?)";
  pool.query(query, [title, description, author, slug], (err, results) => {
    if (err) {
      console.error("Error inserting article:", err);
      return res.status(500).send(err.message);
    }
    res
      .status(201)
      .send({ id: results.insertId, title, description, author, slug });
  });
});

// Endpoint untuk mendapatkan semua artikel
app.get("/articles", (req, res) => {
  const query = "SELECT * FROM articles";
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(results);
  });
});

// Endpoint untuk mendapatkan artikel berdasarkan ID
app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM articles WHERE id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (results.length === 0) {
      return res.status(404).send("Article not found");
    }
    res.status(200).send(results[0]);
  });
});

// Endpoint untuk menghapus artikel berdasarkan ID
app.delete("/articles/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM articles WHERE id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Article not found");
    }
    res.status(200).send({ message: "Article deleted successfully" });
  });
});

// Endpoint untuk memperbarui artikel berdasarkan ID
app.put("/articles/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, author } = req.body;
  const slug = slugify(title);
  const query =
    "UPDATE articles SET title = ?, description = ?, author = ?, slug = ? WHERE id = ?";
  pool.query(query, [title, description, author, slug, id], (err, results) => {
    if (err) {
      console.error("Error updating article:", err);
      return res.status(500).send(err.message);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Article not found");
    }
    res.status(200).send({ message: "Article updated successfully" });
  });
});

// Endpoint untuk memperbarui waktu akses artikel berdasarkan ID
app.put("/articles/access/:id", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE articles SET last_accessed = NOW() WHERE id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res
      .status(200)
      .send({ message: "Article access time updated successfully" });
  });
});

// Endpoint untuk mendapatkan materi yang baru diakses
app.get("/recent-articles", (req, res) => {
  const query = "SELECT * FROM articles ORDER BY last_accessed DESC LIMIT 5";
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(results);
  });
});

// Endpoint untuk mendapatkan artikel baru
app.get("/new-articles", (req, res) => {
  const query = "SELECT * FROM articles ORDER BY created_at DESC LIMIT 5"; // Atur jumlah yang ingin diambil
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
