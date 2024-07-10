import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (!validateInput()) return;

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          let redirectTo = "/beranda"; // Default redirect for users

          switch (data.user.role) {
            case "admin":
              redirectTo = "/admin";
              break;
            case "author":
              redirectTo = "/author";
              break;
            default:
              redirectTo = "/beranda";
          }

          navigate(redirectTo);
        } else {
          if (data.message.includes("Email")) {
            setEmailError(data.message);
          } else if (data.message.includes("Password")) {
            setPasswordError(data.message);
          }
          console.log("Login failed", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const validateInput = () => {
    let isValid = true;
    if (email === "admin" && password === "admin") {
      return true; // Bypass further validation for admin quick login
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Masukkan email yang benar.");
      isValid = false;
    }
    if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter.");
      isValid = false;
    }
    return isValid;
  };

  return (
    <>
      <nav className="Login-Navbar">
        <div className="Login-Nav-Brand">DelCyberClass</div>
        <button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </nav>
      <div className="login-container">
        <div className="login-form">
          <h2>LOGIN</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <div className="error-message">{emailError}</div>}
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
