import React, { useContext } from "react";
import { Container, Typography } from "@mui/material";
import { AuthContext } from "../AuthContext";

function Dashboard() {
  const { auth } = useContext(AuthContext);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {auth.username}!
      </Typography>
      {/* Add more dashboard content here */}
    </Container>
  );
}

export default Dashboard;
