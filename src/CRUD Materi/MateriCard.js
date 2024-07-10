import React from "react";
import "../assets/MateriCard.css";

function MateriCard({ title, author, image, description }) {
  const MAX_LENGTH = 100; // Jumlah karakter maksimum yang ditampilkan

  const truncatedDescription =
    description.length > MAX_LENGTH
      ? description.substring(0, MAX_LENGTH) + "..."
      : description;

  // Fungsi untuk menciptakan objek HTML yang aman
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <div className="materi-card">
      <div className="materi-image">
        <img src={image} alt={title} />
      </div>
      <div className="materi-content">
        <h3>{title}</h3>
        <p
          className="description"
          dangerouslySetInnerHTML={createMarkup(truncatedDescription)}
        ></p>
        <p className="instructor">Instruktur: {author}</p>
      </div>
    </div>
  );
}

export default MateriCard;
