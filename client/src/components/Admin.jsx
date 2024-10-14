import React, { useState, useEffect } from "react";

function Admin() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      setError("Invalid token.");
      return;
    }

    if (decodedToken.role !== "admin") {
      setError("Access denied. Admins only.");
      return;
    }

    // Fetch admin data using the JWT token
    fetch("http://localhost:3000/admin", {
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
        setError("Error accessing admin route");
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Admin Route</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Admin;
