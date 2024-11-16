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
  Button,
  Snackbar,
} from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Optional: You can use Material-UI's styling solutions or CSS modules
// For simplicity, inline styles are used here.

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null
  });
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [endpointStats, setEndpointStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [promoteDialog, setPromoteDialog] = useState({
    open: false,
    userId: null
  });

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeJWT(token);
      if (decodedToken) {
        setCurrentUserEmail(decodedToken.email);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEndpointStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://cadan.xyz/admin/endpoint-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.stats) {
          setEndpointStats(response.data.stats);
        }
      } catch (err) {
        console.error("Error fetching endpoint stats:", err);
        setError("Failed to fetch endpoint statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchEndpointStats();
  }, []);

  const handlePromoteClick = (userId) => {
    setPromoteDialog({ open: true, userId });
  };

  const handleClosePromoteDialog = () => {
    setPromoteDialog({ open: false, userId: null });
  };

  const handlePromoteUser = async () => {
    try {
      setPromoting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        "https://cadan.xyz/admin/promote",
        { userId: promoteDialog.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        // Update the local state to reflect the change
        setUsers(users.map(user => 
          user.id === promoteDialog.userId 
            ? { ...user, role: "admin" }
            : user
        ));
        
        // Show success message
        setSnackbar({
          open: true,
          message: 'User successfully promoted to admin!',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error("Error promoting user:", err);
      setSnackbar({
        open: true,
        message: `Failed to promote user: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    } finally {
      setPromoting(false);
      handleClosePromoteDialog();
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteDialog({ open: true, userId });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://cadan.xyz/admin/delete-user/${deleteDialog.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to remove deleted user
      setUsers(users.filter(user => user.id !== deleteDialog.userId));
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      setSnackbar({
        open: true,
        message: `Failed to delete user: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
                                onClick={() => handlePromoteClick(user.id)}
                                disabled={promoting}
                                color="primary"
                                size="small"
                              >
                                <AdminPanelSettingsIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {currentUserEmail === 'admin@admin.com' && user.email !== 'admin@admin.com' && (
                            <Tooltip title="Delete User">
                              <IconButton
                                onClick={() => handleDeleteClick(user.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
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

      {/* Add Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add Promote Confirmation Dialog */}
      <Dialog
        open={promoteDialog.open}
        onClose={handleClosePromoteDialog}
      >
        <DialogTitle>Confirm Promotion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to promote this user to admin? This will give them full administrative privileges.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePromoteDialog}>Cancel</Button>
          <Button 
            onClick={handlePromoteUser} 
            color="primary"
            disabled={promoting}
          >
            {promoting ? "Promoting..." : "Promote"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add this new section for endpoint statistics */}
      <Box
        sx={{
          marginTop: 4,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography component="h2" variant="h5" gutterBottom>
          Endpoint Statistics
        </Typography>

        {statsLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} sx={{ width: "100%", mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>Method</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Endpoint</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Requests</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {endpointStats.length > 0 ? (
                  endpointStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{stat.method}</TableCell>
                      <TableCell align="center">{stat.endpoint}</TableCell>
                      <TableCell align="center">{stat.requests}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No endpoint statistics available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default Admin;
