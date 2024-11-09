// src/components/Admin.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Optional: You can use Material-UI's styling solutions or CSS modules
// For simplicity, inline styles are used here.

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState("");

  // Function to decode JWT (if needed)
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
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken) {
        setError("Invalid token.");
        setLoading(false);
        return;
      }

      if (decodedToken.role !== "admin") {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://cadan.xyz/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.users) {
          setUsers(response.data.users);
        } else {
          setError("No users found or unable to fetch users.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please log in as an admin.");
        } else {
          setError("Error accessing admin route.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container maxWidth="lg">
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
        <Typography component="h1" variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Display Errors */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Display Loading Indicator */}
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Display Users Table */}
            <TableContainer component={Paper} sx={{ width: "100%", mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Role</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>API Calls Remaining</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell align="center">{user.id}</TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">{user.role}</TableCell>
                        <TableCell align="center">{user.api}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Admin;
