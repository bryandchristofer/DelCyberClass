import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../assets/FormPraktikum.css";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";

function EditPraktikum() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [praktikumName, setPraktikumName] = useState("");
  const [targetMachine, setTargetMachine] = useState("machine1");
  const [steps, setSteps] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPraktikum = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3007/praktikums/${id}`
        );
        const praktikum = result.data;
        console.log(praktikum); // Tambahkan log ini untuk memeriksa data yang diterima
        setPraktikumName(praktikum.title);
        setTargetMachine(praktikum.targetMachine);
        setSteps(praktikum.description);
      } catch (error) {
        console.error("Error fetching praktikum:", error);
      }
    };
    fetchPraktikum();
  }, [id]);

  const handlePraktikumNameChange = useCallback((event) => {
    setPraktikumName(event.target.value);
  }, []);

  const handleStepsChange = useCallback((value) => {
    setSteps(value);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!praktikumName) newErrors.praktikumName = "Praktikum Name is required";
    if (!steps) newErrors.steps = "Practical Steps are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:3007/praktikums/${id}`,
        {
          title: praktikumName,
          targetMachine,
          description: steps,
        }
      );
      setMessage(`Success: ${response.data.message}`);
      navigate("/praktikum-author");
    } catch (error) {
      setMessage(
        `Error: ${error.response ? error.response.data : error.message}`
      );
      console.error("Error updating praktikum:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavbarAuthor />
      <div className="FormPraktikumBody">
        <SidebarAuthor />
        <div className="praktikum-form-container-fullscreen">
          <h1>Edit Praktikum</h1>
          <form onSubmit={handleSubmit}>
            <div className="praktikum-form-group">
              <label>Praktikum Name:</label>
              <input
                type="text"
                value={praktikumName}
                onChange={handlePraktikumNameChange}
                placeholder="Enter the name of the praktikum"
              />
              {errors.praktikumName && (
                <p className="error-message">{errors.praktikumName}</p>
              )}
            </div>
            <div className="praktikum-form-group">
              <label>Practical Steps:</label>
              <ReactQuill
                theme="snow"
                value={steps}
                onChange={handleStepsChange}
              />
              {errors.steps && <p className="error-message">{errors.steps}</p>}
            </div>
            <button
              type="submit"
              className="praktikum-submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
          {message && (
            <p
              className={`praktikum-message ${
                message.startsWith("Error") ? "error" : "success"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPraktikum;
