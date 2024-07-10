import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirmation password
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setSuccessMessage("");

    if (!validateInput()) return;

    const userData = { name, email, password };

    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User registered successfully") {
          setSuccessMessage(
            "Pendaftaran berhasil! Anda akan diarahkan ke halaman login."
          );
          setTimeout(() => navigate("/"), 2000);
        } else {
          setSuccessMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSuccessMessage(
          "Terjadi kesalahan saat pendaftaran. Silakan coba lagi."
        );
      });
  };

  const validateInput = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email tidak boleh kosong.");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Email harus memiliki simbol '@'.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      setPasswordError(
        "Password harus minimal 8 karakter dan mengandung kombinasi huruf dan angka."
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">DelCyberClass</div>
        <button className="login-button" onClick={() => navigate("/")}>
          Login
        </button>
      </nav>
      <div className="register-container">
        <div className="register-form">
          <h2>REGISTER</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="error-message">{emailError}</div>}
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            <button type="submit">Register</button>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
