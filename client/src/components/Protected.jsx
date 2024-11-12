import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

function Protected() {
  const theme = useTheme();

  return (
    <Box>
      <h2 style={{ fontSize: "2em", color: theme.palette.text.primary }}>
        Your Personal Image-to-Text Generator
      </h2>
      <p style={{ fontSize: "1.1em", color: theme.palette.text.primary }}>
        Transform your images into editable, searchable text with ease. Our
        Image-to-Text Generator offers cutting-edge technology to handle
        everything from photos and documents to complex diagrams. Save time and
        streamline your workflow by effortlessly converting images into text.
      </p>

      <Box
        sx={{
          marginTop: "30px",
          padding: "20px",
          background: theme.palette.mode === "light" ? "#f9f9f9" : "#262626",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary.main,
            mb: 2,
            fontWeight: 600,
          }}
        >
          How It Works
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "1.1em",
          }}
        >
          Upload any image, and our AI-powered tool will scan and extract text
          with remarkable accuracy. Whether you're dealing with handwritten
          notes, typed documents, or complex layouts, our service can handle it.
          Get editable text in seconds!
        </Typography>
      </Box>

      <Box
        sx={{
          marginTop: "30px",
          padding: "20px",
          background: theme.palette.mode === "light" ? "#f0f7ff" : "#1a2f42",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary.main,
            mb: 2,
            fontWeight: 600,
          }}
        >
          Why Choose Us?
        </Typography>
        <Box
          component="ul"
          sx={{
            paddingLeft: "20px",
            color: theme.palette.text.primary,
            fontSize: "1.1em",
            "& li": {
              mb: 1,
            },
          }}
        >
          <li>🚀 Fast, user-friendly, and secure</li>
          <li>🧠 Advanced AI with high accuracy rates</li>
          <li>📁 Supports a variety of formats – photos, scans, screenshots</li>
          <li>
            🎁 <strong>20 Free API uses</strong> for all registered users to
            explore without commitment
          </li>
        </Box>
      </Box>
    </Box>
  );
}

export default Protected;
