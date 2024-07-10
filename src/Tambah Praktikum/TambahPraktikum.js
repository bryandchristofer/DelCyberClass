import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../assets/FormPraktikum.css";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";

function TambahPraktikum() {
  const [praktikumName, setPraktikumName] = useState("");
  const [existingNames, setExistingNames] = useState([]);
  const [imageName, setImageName] = useState("");
  const [targetMachine, setTargetMachine] = useState("machine1");
  const [steps, setSteps] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchPraktikumNames() {
      const response = await axios.get("http://localhost:3007/praktikum-names");
      setExistingNames(response.data.map((prak) => prak.title));
    }
    fetchPraktikumNames();
  }, []);

  const handlePraktikumNameChange = useCallback((event) => {
    setPraktikumName(event.target.value);
  }, []);

  const handleImageNameChange = useCallback((event) => {
    setImageName(event.target.value);
  }, []);

  const handleTargetMachineChange = useCallback((event) => {
    setTargetMachine(event.target.value);
  }, []);

  const handleStepsChange = useCallback((value) => {
    setSteps(value);
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!praktikumName) {
      errors.praktikumName = "Praktikum name is required";
    } else if (existingNames.includes(praktikumName)) {
      errors.praktikumName = "Praktikum name must be unique";
    }
    return errors;
  }, [praktikumName, existingNames]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3007/deploy", {
        title: praktikumName,
        imageName,
        targetMachine,
        description: steps,
      });
      setMessage(`Success: ${response.data.message}`);
    } catch (error) {
      setMessage(
        `Error: ${error.response ? error.response.data : error.message}`
      );
      console.error("Error deploying docker image:", error);
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
          <h1>Tambah Praktikum</h1>
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
              <label>Image Name:</label>
              <input
                type="text"
                value={imageName}
                onChange={handleImageNameChange}
              />
              {errors.imageName && (
                <p className="error-message">{errors.imageName}</p>
              )}
            </div>
            <div className="praktikum-form-group">
              <label>Target Machine:</label>
              <select
                value={targetMachine}
                onChange={handleTargetMachineChange}
              >
                <option value="machine1">Machine 1</option>
                <option value="machine2">Machine 2</option>
              </select>
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
              {isLoading ? "Deploying..." : "Deploy"}
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

export default TambahPraktikum;
