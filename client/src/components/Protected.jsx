import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/Context/AuthContext";

function Protected() {
  const { auth } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = auth.token;

    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    fetch("https://cadan.xyz/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Unauthorized") {
          setError("Unauthorized access");
        } else {
          setMessage(data.message);
        }
      })
      .catch((error) => {
        setError("Error accessing protected route");
        console.error(error);
      });
  }, [auth.token]);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1 style={{ color: "#4A90E2", fontSize: "2.5em", marginBottom: "10px" }}>
        Welcome, {auth.username}!
      </h1>
      <h2 style={{ color: "#333", fontSize: "1.8em", marginBottom: "20px" }}>
        Your Personal Image-to-Text Generator
      </h2>
      <p style={{ fontSize: "1.1em" }}>
        Transform your images into editable, searchable text with ease. Our
        Image-to-Text Generator offers cutting-edge technology to handle
        everything from photos and documents to complex diagrams. Save time and
        streamline your workflow by effortlessly converting images into text.
      </p>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ color: "#4A90E2", fontSize: "1.5em" }}>How It Works</h3>
        <p style={{ fontSize: "1.1em" }}>
          Upload any image, and our AI-powered tool will scan and extract text
          with remarkable accuracy. Whether you're dealing with handwritten
          notes, typed documents, or complex layouts, our service can handle it.
          Get editable text in seconds!
        </p>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f0f7ff",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ color: "#4A90E2", fontSize: "1.5em" }}>Why Choose Us?</h3>
        <ul style={{ paddingLeft: "20px", fontSize: "1.1em" }}>
          <li>🚀 Fast, user-friendly, and secure</li>
          <li>🧠 Advanced AI with high accuracy rates</li>
          <li>📁 Supports a variety of formats – photos, scans, screenshots</li>
          <li>
            🎁 <strong>20 Free API uses</strong> for all registered users to
            explore without commitment
          </li>
        </ul>
      </div>

      {error && (
        <p style={{ color: "red", fontSize: "1.1em", marginTop: "20px" }}>
          {error}
        </p>
      )}
      {message && (
        <div style={{ marginTop: "20px", color: "#333", fontSize: "1.1em" }}>
          <p>{message}</p>
        </div>
      )}

      <p style={{ marginTop: "30px", color: "#777", fontSize: "1em" }}>
        Ready to make the most of our service? After your 20 free uses, consider
        our affordable subscription options for unlimited access.
      </p>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p style={{ fontSize: "1.5em", color: "#4A90E2", fontWeight: "bold" }}>
          What are you waiting for?{" "}
          <span style={{ color: "#333" }}>
            Click on "Generator" in the navbar to get started!
          </span>
        </p>
      </div>
    </div>
  );
}

export default Protected;
