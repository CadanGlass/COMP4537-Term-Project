import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  useTheme, 
  Grid, 
  Card, 
  CardContent,
  Button,
  LinearProgress,
  Alert,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import SchoolIcon from '@mui/icons-material/School';
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

function Protected() {
  const theme = useTheme();
  const [apiCallCount, setApiCallCount] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApiCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in to use this feature.");
          return;
        }

        const response = await axios.get("https://cadan.xyz/get-api-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { apiCount } = response.data;
        setApiCallCount(apiCount);
      } catch (err) {
        console.error("Error fetching API count:", err);
        setError("Failed to retrieve API call information.");
      }
    };

    fetchApiCount();
  }, []);

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 2 
          }}
        >
          Your Personal Image-to-Text Generator
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: '800px' 
          }}
        >
          Transform your images into editable, searchable text with ease. Our
          advanced AI technology handles everything from photos and documents to complex diagrams.
        </Typography>
      </Box>

      {/* API Usage Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Usage
          </Typography>
          <Box sx={{ mt: 2 }}>
            {apiCallCount === null ? (
              <LinearProgress />
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Remaining API Calls
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(apiCallCount / 20) * 100}
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {apiCallCount} of 20 calls remaining
                </Typography>
              </>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Quick Start Guide */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" /> Quick Start Guide
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="1. Navigate to Generator" 
                  secondary="Click the 'Generator' button in the navigation bar"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="2. Upload Image" 
                  secondary="Select an image file from your device"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="3. Process Image" 
                  secondary="Click 'Generate Caption' to extract text"
                />
              </ListItem>
            </List>
            <Button 
              variant="contained" 
              component={RouterLink}
              to="/image-text-generator"
              sx={{ mt: 2 }}
            >
              Go to Generator
            </Button>
          </Paper>

          {/* Supported Formats */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpIcon color="primary" /> Supported Formats
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Image Types:
                </Typography>
                <List dense>
                  <ListItem>• JPEG/JPG</ListItem>
                  <ListItem>• PNG</ListItem>
                  <ListItem>• GIF (first frame)</ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Size Limits:
                </Typography>
                <List dense>
                  <ListItem>• Maximum file size: 5MB</ListItem>
                  <ListItem>• Minimum dimensions: 50x50px</ListItem>
                  <ListItem>• Maximum dimensions: 2000x2000px</ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Tips & Best Practices */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TipsAndUpdatesIcon color="primary" /> Tips for Best Results
            </Typography>
            <List>
              {[
                "Ensure good lighting and contrast in images",
                "Use high-resolution, clear images",
                "Center text in the frame when possible",
                "Avoid blurry or distorted images",
                "Keep images under 5MB for best performance"
              ].map((tip, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <EmojiObjectsIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* API Usage Info */}
          <Paper sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h5" gutterBottom>
              API Information
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              Each image processing request counts as one API call. Free accounts start with 20 API calls.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Need more API calls? Contact support for information about premium plans.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Call-to-Action Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #1976d2, #1565c0)'
            : 'linear-gradient(135deg, #90caf9, #42a5f5)',
          borderRadius: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.1)',
            transform: 'skewY(-2deg)',
          },
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            position: 'relative',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Ready to Get Started?
        </Typography>
        <Typography 
          sx={{ 
            mb: 3, 
            position: 'relative',
            maxWidth: '600px',
            margin: '0 auto',
            opacity: 0.9,
          }}
        >
          Transform your images into text now with our powerful AI technology.
          Fast, accurate, and easy to use.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/image-text-generator"
          size="large"
          sx={{
            position: 'relative',
            bgcolor: 'rgba(255,255,255,0.2)',
            color: '#ffffff',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(4px)',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          Try Generator Now
        </Button>
      </Box>
    </Box>
  );
}

export default Protected;
