// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Protected from "./components/Protected"; // Or create a separate Dashboard component
import Logout from "./components/Logout";
import ImageTextGenerator from "./components/ImageTextGenerator";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/Context/AuthContext";
import { Container, Box, Typography } from "@mui/material";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Protected />
                </PrivateRoute>
              }
            />
            <Route
              path="/image-text-generator"
              element={
                <PrivateRoute>
                  <ImageTextGenerator />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path="/logout" element={<Logout />} />
            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <Box sx={{ textAlign: "center", mt: 8 }}>
                  <Typography variant="h4" color="error">
                    404 Not Found
                  </Typography>
                </Box>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
