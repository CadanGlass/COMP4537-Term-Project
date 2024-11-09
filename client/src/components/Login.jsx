import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Ensure the path is correct

const Login = () => {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Access the login function from AuthContext
  const { login } = useContext(AuthContext);

  // useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  // handleSubmit function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Removed password length check as per your request

    setIsLoading(true); // Start loading

    try {
      const response = await fetch("https://cadan.xyz/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, role } = data;

        if (!token || !role) {
          setError("Invalid response from server.");
          setIsLoading(false);
          return;
        }

        login(email, token, role); // Pass email, token, and role to context
        setError("");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Error logging in. Please try again later.");
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
