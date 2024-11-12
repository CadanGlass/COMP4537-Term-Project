// src/components/Login.jsx
import React, { useState, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Paper,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import axios from "axios";
import { useTheme } from '@mui/material/styles';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://cadan.xyz/login", {
        email,
        password,
      });

      if (response.data.token) {
        login(email, response.data.token, response.data.expiresIn);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
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
          Login
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

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link
              component={RouterLink}
              to="/request-reset-password"
              variant="body2"
              sx={{
                color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Forgot password?
            </Link>
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{
                color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
