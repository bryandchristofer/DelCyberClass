import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/UploadForm.css";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";

function imageHandler() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();
  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to server
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Insert image in the editor
      const range = this.quill.getSelection();
      const link = response.data.url; // URL of uploaded image
      this.quill.insertEmbed(range.index, "image", link);
    }
  };
}

function TambahMateri() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description || !author) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    const article = { title, description, author };
    try {
      await axios.post("http://localhost:5000/articles", article);
      setTitle("");
      setDescription("");
      setAuthor("");
      toast.success("Materi berhasil ditambahkan!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan materi.");
    }
  };

  return (
    <div>
      <NavbarAuthor />
      <div className="UploadFormBody">
        <SidebarAuthor />
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul Materi</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul materi"
              />
            </div>
            <div className="form-group">
              <label>Nama Pembuat</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Masukkan nama pembuat"
              />
              <div className="form-group">
                <label>Deskripsi Materi</label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  placeholder="Tulis isi materi di sini"
                  style={{ height: "300px" }}
                />
              </div>
            </div>
            <button className="Tambah-Materi-Submit-Button" type="submit">
              Upload Materi
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default TambahMateri;
