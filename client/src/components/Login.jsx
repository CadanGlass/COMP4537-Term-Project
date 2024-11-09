// src/components/Login.js

import React, { useState, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Context/AuthContext"; // Ensure the path is correct

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Removed local token state as per previous implementation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("https://cadan.xyz/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Updated payload
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming the backend returns 'role' along with the token
        // Example response: { token: "JWT_TOKEN", role: "admin" }
        const { token, role } = data;

        if (!token || !role) {
          setError("Invalid response from server.");
          return;
        }

        // Use AuthContext's login function
        login(email, token, role); // Pass email, token, and role
        setError("");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        // Display error message from server or a default message
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Error logging in. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          {/* Email Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email" // Changed type to 'email'
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Display Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
