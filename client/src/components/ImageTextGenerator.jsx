// src/components/ImageTextGenerator.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled component for the file input label
const Input = styled("input")({
  display: "none",
});

function ImageTextGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null); // To store base64 image data
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  // States for API call tracking
  const [apiCallCount, setApiCallCount] = useState(null); // Initialize as null to indicate loading
  const maxApiCalls = 20;
  const [maxedOut, setMaxedOut] = useState(false);

  // Fetch the current API count from the server on component mount
  useEffect(() => {
    const fetchApiCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in to use this feature.");
          return;
        }

        const response = await axios.get(
          "https://cadan.xyz/get-api-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { apiCount, maxedOut } = response.data;
        setApiCallCount(apiCount);
        setMaxedOut(maxedOut);
      } catch (err) {
        console.error("Error fetching API count:", err);
        setError("Failed to retrieve API call information.");
      }
    };

    fetchApiCount();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setCaption("");
    setError("");
    setUploadProgress(0);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Extract base64 string without the prefix
        const base64String = reader.result.split(",")[1];
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !imageData) {
      setError("Please select an image file.");
      return;
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPEG, PNG, and GIF images are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError("Image size should not exceed 5MB.");
      return;
    }

    const payload = {
      imageData, // Sending base64 string without the prefix
    };

    setLoading(true);
    setError("");
    setCaption("");
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in to use this feature.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://4537llm.online/generate-caption",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          onUploadProgress: (progressEvent) => {
            // Optional: If you're sending a large payload, track progress
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const { caption, apiCount, maxedOut } = response.data;
      setCaption(caption);
      setApiCallCount(apiCount);
      setMaxedOut(maxedOut);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        if (err.response.data.message.toLowerCase().includes("max")) {
          setMaxedOut(true);
        }
      } else {
        setError("Failed to generate caption.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining API calls
  const remainingCalls = maxApiCalls - (apiCallCount || 0);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography component="h2" variant="h5" gutterBottom>
          Image-to-Text Generator
        </Typography>

        {/* Display API Call Information */}
        <Box sx={{ width: "100%", mb: 2 }}>
          {apiCallCount === null ? (
            <LinearProgress />
          ) : apiCallCount > 0 ? (
            <Alert severity="info">
              You have {remainingCalls} free API call
              {remainingCalls !== 1 ? "s" : ""} remaining.
            </Alert>
          ) : (
            <Alert severity="warning">
              You have reached the maximum of {maxApiCalls} free API calls.
              Additional calls may be subject to charges.
            </Alert>
          )}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
          noValidate
        >
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              component="span"
              fullWidth
              sx={{ mb: 2 }}
            >
              Select Image
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              Selected File: {selectedFile.name}
            </Typography>
          )}
          {imagePreview && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <img
                src={imagePreview}
                alt="Selected"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary">
                Upload Progress: {uploadProgress}%
              </Typography>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Generating...
              </>
            ) : (
              "Generate Caption"
            )}
          </Button>
          {error && (
            <Alert severity={maxedOut ? "warning" : "error"} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {caption && (
            <Alert severity="success">
              <Typography variant="h6">Generated Caption:</Typography>
              <Typography variant="body1">{caption}</Typography>
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ImageTextGenerator;
