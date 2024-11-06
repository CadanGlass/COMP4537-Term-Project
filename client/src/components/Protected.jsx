import React, { useState, useEffect } from "react";

function Protected() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

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
  }, []);

  return (
    <div>
      <h1>Protected Route</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Protected;
