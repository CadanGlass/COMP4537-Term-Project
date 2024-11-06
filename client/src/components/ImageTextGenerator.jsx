// src/components/ImageTextGenerator.js

import React, { useState } from "react";
import axios from "axios"; // Ensure Axios is installed: npm install axios

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
    <div className="image-text-generator">
      <h2>Image-to-Text Generator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="Selected"
              style={{ width: "100%", maxWidth: "300px", marginTop: "10px" }}
            />
          </div>
        )}
        {uploadProgress > 0 && (
          <div>
            <progress value={uploadProgress} max="100" />
            <span> {uploadProgress}%</span>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Caption"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {caption && (
        <div>
          <h3>Generated Caption:</h3>
          <p>{caption}</p>
        </div>
      )}
    </div>
  );
}

export default ImageTextGenerator;
