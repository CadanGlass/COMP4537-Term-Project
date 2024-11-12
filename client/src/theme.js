// src/theme.js

import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1976d2' : '#90caf9',
    },
    secondary: {
      main: mode === 'light' ? '#dc004e' : '#f48fb1',
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      alternate: mode === 'light' ? '#f5f5f5' : '#262626',
    },
    text: {
      primary: mode === 'light' ? '#333333' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#b3b3b3',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
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
  },
});
