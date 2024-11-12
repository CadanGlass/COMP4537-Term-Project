// src/theme.js

import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1976d2' : '#90caf9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#dc004e' : '#f48fb1',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f8f9fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      alternate: mode === 'light' ? '#f5f5f5' : '#262626',
      card: mode === 'light' ? '#ffffff' : '#2d2d2d',
      form: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#333333' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#b3b3b3',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f8f9fa' : '#121212',
          color: mode === 'light' ? '#333333' : '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#2d2d2d',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.1)'
              : '0 4px 20px rgba(0,0,0,0.5)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#1976d2' : '#272727',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'light' ? 'transparent' : '#2d2d2d',
            '& fieldset': {
              borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            backgroundColor: mode === 'light' ? '#1976d2' : '#90caf9',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#1565c0' : '#64b5f6',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
            color: mode === 'light' ? '#1976d2' : '#90caf9',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? '#1976d2' : '#90caf9',
        },
      },
    },
  },
});
