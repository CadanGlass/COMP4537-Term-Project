// src/components/ImageTextGenerator.jsx

import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
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
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

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
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
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

    const formData = new FormData();
    formData.append("file", selectedFile); // Ensure the field name is "file"

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
        "https://146.190.45.54/generate-caption/", // Updated URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setCaption(response.data.caption);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to generate caption.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            <Alert severity="error" sx={{ mb: 2 }}>
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
