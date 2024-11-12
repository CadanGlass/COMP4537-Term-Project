// src/components/Navbar.js

import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from './Context/ThemeContext';

function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="static" color="primary" elevation={2}>
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
            gap: 1.5,
          }}
        >
          {/* New Creative Logo Design */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: mode === 'light'
                ? 'conic-gradient(from 45deg, #2196f3, #42a5f5, #2196f3)'
                : 'conic-gradient(from 45deg, #90caf9, #42a5f5, #90caf9)',
              animation: 'spin 15s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: '3px',
                borderRadius: '50%',
                background: mode === 'light' ? '#1976d2' : '#272727',
              },
            }}
          >
            {/* Inner Content */}
            <Box
              sx={{
                position: 'absolute',
                inset: '6px',
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#fff',
                borderLeftColor: '#fff',
                zIndex: 2,
              }}
            />
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#fff',
                zIndex: 3,
                fontFamily: 'monospace',
              }}
            >
              P
            </Typography>
          </Box>

          {/* Updated Brand Text */}
          <Typography 
            variant="h5" 
            component="div"
            sx={{ 
              fontWeight: 800,
              letterSpacing: '0.5px',
              position: 'relative',
              background: mode === 'light'
                ? 'linear-gradient(45deg, #fff, #e3f2fd)'
                : 'linear-gradient(45deg, #fff, #90caf9)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: mode === 'light' 
                ? '2px 2px 4px rgba(0,0,0,0.2)'
                : '2px 2px 4px rgba(0,0,0,0.3)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                transform: 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
              },
              '&:hover::after': {
                transform: 'scaleX(1)',
              },
            }}
          >
            PixelParse
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {auth.isLoggedIn ? (
            <>
              <Button 
                component={Link} 
                to="/dashboard" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/image-text-generator"
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Generator
              </Button>
              <Button 
                component={Link} 
                to="/admin" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Admin
              </Button>
              <Button 
                component={Link} 
                to="/logout" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                component={Link} 
                to="/login" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Register
              </Button>
            </>
          )}
          <IconButton 
            color="inherit" 
            onClick={toggleTheme} 
            sx={{ 
              ml: 1,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
