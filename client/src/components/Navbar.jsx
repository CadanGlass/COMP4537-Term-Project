// src/components/Navbar.js

import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import logo from "../assets/logo.png";
function Navbar() {
  const { auth, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo and App Name */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="PixelParse Logo"
            sx={{
              width: 40, // Adjust size as needed
              height: 40,
              marginRight: 1, // Spacing between logo and text
            }}
          />
          <Typography variant="h6" component="div">
            PixelParse
          </Typography>
        </Box>
        {/* Navigation Links */}
        <Box>
          {auth.isLoggedIn ? (
            <>
              {/* Protected Routes */}
              <Button component={Link} to="/dashboard" color="inherit">
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/image-text-generator"
                color="inherit"
              >
                Image Text Generator
              </Button>
              <Button component={Link} to="/admin" color="inherit">
                Admin
              </Button>
              {/* Logout Button Navigates to /logout */}
              <Button component={Link} to="/logout" color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Public Routes */}
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/register" color="inherit">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
