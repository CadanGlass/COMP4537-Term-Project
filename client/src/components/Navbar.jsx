// src/components/Navbar.js

import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

function Navbar() {
  const { auth, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* App Name/Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/" color="inherit">
            My App
          </Button>
        </Typography>

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
