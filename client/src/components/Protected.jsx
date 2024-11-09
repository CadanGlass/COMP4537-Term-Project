// src/components/Protected.js

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/Context/AuthContext";

function Protected() {
  const { auth } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Use the token from auth state
    const token = auth.token;

    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    // Fetch protected data using the JWT token
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
    <div>
      <h1>Welcome, {auth.username}!</h1>
      <h2>Protected Route</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Protected;
