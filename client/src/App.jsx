// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar"; // Updated Navbar
import Home from "./components/Home"; // Updated Home
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Protected from "./components/Protected";
import Logout from "./components/Logout";
import ImageTextGenerator from "./components/ImageTextGenerator";
import PrivateRoute from "./components/PrivateRoute";

import { Container, Box, Typography } from "@mui/material"; // Import Box here

function App() {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          {/* Define a route for the base path ("/") */}
          <Route path="/" element={<Home />} />
          {/* Your other routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/protected" element={<Protected />} />
          <Route
            path="/image-text-generator"
            element={
              <PrivateRoute>
                <ImageTextGenerator />
              </PrivateRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          {/* Fallback route for undefined paths */}
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
  );
}

export default App;
