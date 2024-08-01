const express = require("express");
const cors = require("cors"); // Tambahkan ini jika Anda ingin frontend berkomunikasi dengan backend
const app = express();
const PORT = 3002;

app.use(cors()); // Gunakan middleware CORS
app.use(express.json());

// Endpoint sederhana untuk menerima data
app.post("/submit", (req, res) => {
  const { script } = req.body;
  console.log("Received script:", script);
  // Dalam praktek nyata, Anda akan melakukan sesuatu dengan skrip ini
  // seperti menyimpan ke database, atau mengevaluasi dalam lingkungan terisolasi
  res.send({ success: true, script });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
