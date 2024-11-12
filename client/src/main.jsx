// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { getTheme } from "./theme"; // Import getTheme function instead of default export
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // Normalize styles across browsers

const theme = getTheme('light'); // Create theme with light mode

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline CSS */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
