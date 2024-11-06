// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme"; // Import the custom theme
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // Normalize styles across browsers

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline CSS */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
