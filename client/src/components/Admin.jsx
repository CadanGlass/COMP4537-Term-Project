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
  IconButton,
  Tooltip,
} from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Optional: You can use Material-UI's styling solutions or CSS modules
// For simplicity, inline styles are used here.

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState("");
  const [promoting, setPromoting] = useState(false);

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

  const handlePromoteUser = async (userId) => {
    try {
      setPromoting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "https://cadan.xyz/admin/promote",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        // Update the local state to reflect the change
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, role: "admin" }
            : user
        ));
      }
    } catch (err) {
      console.error("Error promoting user:", err);
      setError("Failed to promote user to admin.");
    } finally {
      setPromoting(false);
    }
  };

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
          bgcolor: 'background.paper',
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
                    <TableCell align="center">
                      <strong>Actions</strong>
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
                        <TableCell align="center">
                          {user.role === "user" && (
                            <Tooltip title="Promote to Admin">
                              <IconButton
                                onClick={() => handlePromoteUser(user.id)}
                                disabled={promoting}
                                color="primary"
                                size="small"
                              >
                                <AdminPanelSettingsIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
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
