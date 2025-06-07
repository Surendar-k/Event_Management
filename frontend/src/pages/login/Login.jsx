import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text(); // read raw text
      const data = text ? JSON.parse(text) : {}; // safely parse if not empty

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save user data (token or email)
      localStorage.setItem("userData", JSON.stringify(data));

      // Redirect to /event page
      navigate("/event");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <form className="signup-container" onSubmit={handleSubmit}>
        <div className="background-circles"></div>
        <div className="bubble-container">
          <div className="big-bubble"></div>
          <div className="small-bubble"></div>
          <div className="top-bubble"></div>
        </div>
        <div className="empty-box"></div>

        <div className="signup-box">
          <h2 className="title">Login</h2>
          <div className="signup-box-container">
            <label htmlFor="email">Email</label>
            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FiEye
                className="eye-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <a href="#" className="forgot">Forgot password?</a>
            <button
              type="submit"
              className="s-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
