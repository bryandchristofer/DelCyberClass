import React, { useState } from "react";

export default function XSSInput() {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });
    const data = await response.text();
    // Asumsikan server merespons dengan komentar yang dimasukkan (untuk tujuan demonstrasi)
    alert(`Server Response: ${data}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="comment">Komentar:</label>
      <br />
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="4"
        cols="50"
      ></textarea>
      <br />
      <button type="submit">Kirim Komentar</button>
    </form>
  );
}
