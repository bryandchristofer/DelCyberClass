require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Periksa apakah JWT_SECRET terdefinisi
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

// Fungsi untuk memverifikasi token dan mendapatkan role dari user
const authenticateJwt = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

// Database pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Membuat tabel Users jika belum ada
const initializeDb = () => {
  pool.query(
    `CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      UNIQUE KEY unique_email (email)
    )`,
    (error) => {
      if (error) throw error;
      console.log("Users table is ready.");

      // Tambahkan akun admin ke database jika belum ada
      addAdminAccount();
    }
  );
};

const addAdminAccount = () => {
  const adminEmail = "admin@admin.com";
  const adminPassword = "admin123"; // Password sederhana (sebaiknya gunakan yang lebih kompleks di produksi)
  const adminRole = "admin";

  bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
    if (err) throw err;

    // Cek apakah akun admin sudah ada
    pool.query(
      "SELECT * FROM Users WHERE email = ?",
      [adminEmail],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          // Jika tidak ada, tambahkan akun admin
          pool.query(
            "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ["Admin", adminEmail, hashedPassword, adminRole],
            (error) => {
              if (error) throw error;
              console.log("Admin account added.");
            }
          );
        }
      }
    );
  });
};

// Endpoint untuk registrasi oleh Admin
app.post("/admin/register", authenticateJwt, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .send({ message: "Access denied. Only admins can perform this action." });
  }

  const { name, email, password, role } = req.body;

  // Validasi role
  if (!["user", "author"].includes(role)) {
    return res.status(400).send({ message: "Invalid role specified" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({ error: "Error hashing password" });
      return;
    }

    pool.query(
      "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (error) => {
        if (error) {
          console.error("Error adding user to database:", error);
          res.status(500).send({ error: "Error adding user to database" });
          return;
        }

        res.status(201).send({ message: "User registered successfully" });
      }
    );
  });
});

// Endpoint untuk registrasi
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({ error: "Error hashing password" });
      return;
    }

    pool.query(
      "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name, email, hashedPassword],
      (error) => {
        if (error) {
          console.error("Error adding user to database:", error);
          res.status(500).send({ error: "Error adding user to database" });
          return;
        }

        res.status(201).send({ message: "User registered successfully" });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  pool.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        return res.status(500).send({ error: "Login failed" });
      }
      if (results.length === 0) {
        return res.status(401).send({ message: "Email is incorrect" });
      }

      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          return res.status(500).send({ error: "Error checking password" });
        }
        if (!isMatch) {
          return res.status(401).send({ message: "Password is incorrect" });
        }

        const token = jwt.sign(
          { id: results[0].id, role: results[0].role },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );

        res.send({
          message: "Logged in successfully",
          token,
          user: { role: results[0].role },
        });
      });
    }
  );
});

// Endpoint khusus admin
app.get("/admin-only", authenticateJwt, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }

  res.send({ message: "Welcome to the admin area." });
});

// Endpoint khusus user
app.get("/user-only", authenticateJwt, (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).send({ message: "Access denied. Users only." });
  }

  res.send({ message: "Welcome to the user area." });
});

initializeDb();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
