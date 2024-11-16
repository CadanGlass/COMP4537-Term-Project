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
import { ADMIN_STRINGS } from '../constants/strings';

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
        setError(ADMIN_STRINGS.ERRORS.NO_TOKEN);
        setLoading(false);
        return;
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken) {
        setError(ADMIN_STRINGS.ERRORS.INVALID_TOKEN);
        setLoading(false);
        return;
      }

      if (decodedToken.role !== "admin") {
        setError(ADMIN_STRINGS.ERRORS.ACCESS_DENIED);
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
          setError(ADMIN_STRINGS.ERRORS.NO_USERS);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError(ADMIN_STRINGS.ERRORS.UNAUTHORIZED);
        } else {
          setError(ADMIN_STRINGS.ERRORS.ADMIN_ROUTE_ERROR);
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
        setError(ADMIN_STRINGS.ERRORS.STATS_ERROR);
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
          message: ADMIN_STRINGS.NOTIFICATIONS.PROMOTE_SUCCESS,
          severity: 'success'
        });
      }
    } catch (err) {
      console.error(ADMIN_STRINGS.ERRORS.PROMOTE_ERROR, err);
      setSnackbar({
        open: true,
        message: `${ADMIN_STRINGS.ERRORS.PROMOTE_ERROR} ${err.response?.data?.message || err.message}`,
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
        message: ADMIN_STRINGS.NOTIFICATIONS.DELETE_SUCCESS,
        severity: 'success'
      });
    } catch (err) {
      console.error(ADMIN_STRINGS.ERRORS.DELETE_ERROR, err);
      setSnackbar({
        open: true,
        message: `${ADMIN_STRINGS.ERRORS.DELETE_ERROR} ${err.response?.data?.message || err.message}`,
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
          {ADMIN_STRINGS.TITLE}
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
                      <strong>{ADMIN_STRINGS.TABLE.ID}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{ADMIN_STRINGS.TABLE.EMAIL}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{ADMIN_STRINGS.TABLE.ROLE}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{ADMIN_STRINGS.TABLE.API_CALLS}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{ADMIN_STRINGS.TABLE.ACTIONS}</strong>
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
                            <Tooltip title={ADMIN_STRINGS.BUTTONS.PROMOTE_TOOLTIP}>
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
                            <Tooltip title={ADMIN_STRINGS.BUTTONS.DELETE_TOOLTIP}>
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
                        {ADMIN_STRINGS.TABLE.NO_USERS_FOUND}
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
        <DialogTitle>{ADMIN_STRINGS.DIALOGS.DELETE.TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {ADMIN_STRINGS.DIALOGS.DELETE.CONTENT}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {ADMIN_STRINGS.DIALOGS.DELETE.CANCEL}
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            {ADMIN_STRINGS.DIALOGS.DELETE.CONFIRM}
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
        <DialogTitle>{ADMIN_STRINGS.DIALOGS.PROMOTE.TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {ADMIN_STRINGS.DIALOGS.PROMOTE.CONTENT}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePromoteDialog}>
            {ADMIN_STRINGS.DIALOGS.PROMOTE.CANCEL}
          </Button>
          <Button onClick={handlePromoteUser} color="primary" disabled={promoting}>
            {promoting ? ADMIN_STRINGS.DIALOGS.PROMOTE.CONFIRMING : ADMIN_STRINGS.DIALOGS.PROMOTE.CONFIRM}
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
          {ADMIN_STRINGS.STATS.TITLE}
        </Typography>

        {statsLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} sx={{ width: "100%", mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>{ADMIN_STRINGS.STATS.TABLE.METHOD}</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>{ADMIN_STRINGS.STATS.TABLE.ENDPOINT}</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>{ADMIN_STRINGS.STATS.TABLE.REQUESTS}</strong>
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
                      {ADMIN_STRINGS.STATS.TABLE.NO_STATS}
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
