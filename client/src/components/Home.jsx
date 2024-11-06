// src/components/Home.js

import React from "react";
import { Container, Box, Typography } from "@mui/material";

function Home() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the App
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore the features by navigating through the links above.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
