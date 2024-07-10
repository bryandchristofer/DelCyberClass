import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/UploadForm.css";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";
import { useParams, useNavigate } from "react-router-dom";

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
      try {
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
      } catch (error) {
        toast.error("Failed to upload image.");
      }
    }
  };
}

function EditMateri() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/articles/${id}`);
        setTitle(result.data.title);
        setDescription(result.data.description);
        setAuthor(result.data.author);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching article data.");
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

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
      toast.error("All fields must be filled!");
      return;
    }

    const article = { title, description, author };
    try {
      await axios.put(`http://localhost:5000/articles/${id}`, article);
      toast.success("Material updated successfully!");
      setTimeout(() => {
        navigate("/materi-author");
      }, 2000);
    } catch (error) {
      toast.error("An error occurred while updating the material.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                placeholder="Enter the title of the material"
              />
            </div>
            <div className="form-group">
              <label>Nama Pembuat</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter the author's name"
              />
              <div className="form-group">
                <label>Deskripsi Materi</label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  placeholder="Enter material description here"
                  style={{ height: "300px" }}
                />
              </div>
            </div>
            <button className="Tambah-Materi-Submit-Button" type="submit">
              Update Material
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default EditMateri;
