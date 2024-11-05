// src/components/Register.js

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to 'user' role
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://cadan.xyz/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }), // Include role in registration
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in.");
        setError("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error registering user");
      console.error(error);
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
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            name="role"
            label="Role (optional)"
            type="text"
            id="role"
            placeholder="Enter role (e.g., admin)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
