// src/components/Register.js

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

function Register() {
  const theme = useTheme();
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to 'user' role
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    // Optionally, ensure the password field is not empty
    if (!password) {
      setError("Password is required.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch("https://cadan.xyz/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }), // Updated payload
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in.");
        setError("");
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        setError(data.message || "Registration failed.");
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Error registering user.");
      setSuccessMessage("");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
          borderRadius: 2,
        }}
      >
        <Typography 
          component="h1" 
          variant="h5" 
          gutterBottom
          sx={{ 
            color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
            fontWeight: 600 
          }}
        >
          Register
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
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#2d2d2d',
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                },
              },
            }}
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#2d2d2d',
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                },
              },
            }}
          />

          {/* Role Selection */}
          <FormControl 
            fullWidth 
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#2d2d2d',
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                },
              },
            }}
          >
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Display Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Display Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              bgcolor: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
              color: '#ffffff',
              '&:hover': {
                bgcolor: theme.palette.mode === 'light' ? '#1565c0' : '#64b5f6',
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
