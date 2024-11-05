// src/components/Navbar.js

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/" color="inherit">
            My App
          </Button>
        </Typography>
        <Box>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <Button component={Link} to="/register" color="inherit">
            Register
          </Button>
          <Button component={Link} to="/admin" color="inherit">
            Admin
          </Button>
          <Button component={Link} to="/protected" color="inherit">
            Protected
          </Button>
          <Button component={Link} to="/image-text-generator" color="inherit">
            Image-to-Text Generator
          </Button>
          <Button component={Link} to="/logout" color="inherit">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
