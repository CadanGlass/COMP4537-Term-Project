// src/components/Home.js

import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ImageIcon from "@mui/icons-material/Image";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import { Link as RouterLink } from "react-router-dom"; // Import Link from react-router-dom
import logo from "../assets/logo.png";
import { useTheme as useMuiTheme } from '@mui/material/styles';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

function Home() {
  const theme = useMuiTheme();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: { xs: 3, md: 6 },
          backgroundColor: theme.palette.mode === 'light' ? '#e3f2fd' : 'rgba(25, 118, 210, 0.08)',
          borderRadius: 4,
          mt: 4,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.1)'
              : '0 4px 20px rgba(0,0,0,0.5)',
          },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom>
              Transform Your Images into Text Effortlessly
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Our cutting-edge Image to Text Generator allows you to extract and
              convert text from images seamlessly. Whether you're digitizing
              documents, extracting data, or enhancing accessibility, our tool
              delivers accurate and swift results.
            </Typography>
            {/* Updated Button: Navigates to Login Page */}
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              size="large"
            >
              Get Started
            </Button>
          </Grid>

          {/* Right Side - Logo + Features */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: 2,
              }}
            >
              {/* Updated Logo */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 300,
                  height: 300,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                {/* Main Logo Container */}
                <Box
                  sx={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: theme.palette.mode === 'light'
                      ? 'conic-gradient(from 45deg, #1976d2, #42a5f5, #1976d2, #42a5f5)'
                      : 'conic-gradient(from 45deg, #90caf9, #42a5f5, #90caf9, #42a5f5)',
                    animation: 'spin 20s linear infinite',
                    '@keyframes spin': {
                      '0%': {
                        transform: 'rotate(0deg)',
                      },
                      '100%': {
                        transform: 'rotate(360deg)',
                      }
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '15px',
                      borderRadius: '50%',
                      background: theme.palette.mode === 'light' ? '#1976d2' : '#272727',
                    },
                  }}
                >
                  {/* Inner Rings */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: '30px',
                      borderRadius: '50%',
                      border: '4px solid transparent',
                      borderTopColor: '#fff',
                      borderLeftColor: '#fff',
                      animation: 'spinReverse 10s linear infinite',
                      '@keyframes spinReverse': {
                        '0%': {
                          transform: 'rotate(360deg)',
                        },
                        '100%': {
                          transform: 'rotate(0deg)',
                        }
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: '45px',
                      borderRadius: '50%',
                      border: '4px solid transparent',
                      borderBottomColor: '#fff',
                      borderRightColor: '#fff',
                      animation: 'spin 8s linear infinite',
                    }}
                  />
                  {/* Center Text */}
                  <Typography
                    sx={{
                      position: 'relative',
                      fontSize: '72px',
                      fontWeight: 'bold',
                      color: '#fff',
                      fontFamily: 'monospace',
                      zIndex: 2,
                      textShadow: '0 0 10px rgba(255,255,255,0.5)',
                    }}
                  >
                    P
                  </Typography>
                </Box>
                {/* Enhanced Glow Effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: theme.palette.mode === 'light'
                      ? 'radial-gradient(circle, rgba(25,118,210,0.3) 0%, rgba(255,255,255,0) 70%)'
                      : 'radial-gradient(circle, rgba(144,202,249,0.3) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(30px)',
                    zIndex: -1,
                  }}
                />
              </Box>

              {/* Key Features List with updated styling */}
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{
                  color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Key Features
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  '& li': {
                    color: theme.palette.text.primary,
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '"✓"',
                      marginRight: '10px',
                      color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                      fontWeight: 'bold',
                    },
                  },
                }}
              >
                <li>High-accuracy text extraction</li>
                <li>Supports various image formats</li>
                <li>Fast processing and instant results</li>
                <li>User-friendly and intuitive interface</li>
                <li>Perfect for document digitization</li>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mt: 12 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: theme.palette.mode === 'light' 
              ? 'linear-gradient(45deg, #1976d2, #dc004e)'
              : 'linear-gradient(45deg, #90caf9, #f48fb1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 6,
          }}
        >
          Why Choose Our Generator?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Feature 1 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", padding: 2, height: "100%" }}>
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <ImageIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  High Accuracy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our advanced algorithms ensure precise text extraction from
                  any image.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Feature 2 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", padding: 2, height: "100%" }}>
              <Avatar
                sx={{
                  bgcolor: "#388e3c",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <TextSnippetIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Multi-Language Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports extraction from images containing text in multiple
                  languages.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Feature 3 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", padding: 2, height: "100%" }}>
              <Avatar
                sx={{
                  bgcolor: "#f57c00",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <SpeedIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Fast Processing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get your text extracted and ready in seconds with our
                  optimized processes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Feature 4 */}
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", padding: 2, height: "100%" }}>
              <Avatar
                sx={{
                  bgcolor: "#d32f2f",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <SecurityIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Secure & Private
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your images and data are processed securely with utmost
                  privacy.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{
          mt: 12,
          backgroundColor: theme.palette.background.alternate,
          padding: { xs: 3, md: 6 },
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Step 1 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <ImageIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Upload Your Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose an image containing the text you want to extract.
              </Typography>
            </Box>
          </Grid>
          {/* Step 2 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "#388e3c",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <TextSnippetIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Extract Text
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our system processes the image and accurately extracts the
                embedded text.
              </Typography>
            </Box>
          </Grid>
          {/* Step 3 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "#f57c00",
                  margin: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <SpeedIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Download or Copy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Retrieve your extracted text instantly for your use.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          What Our Users Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Testimonial 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  alt="User 1"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">Jane Doe</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Content Writer
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                "This Image to Text Generator has revolutionized the way I
                handle my content. It's fast, accurate, and incredibly
                user-friendly!"
              </Typography>
            </Card>
          </Grid>
          {/* Testimonial 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  alt="User 2"
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">John Smith</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data Analyst
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                "Extracting data from scanned documents was a hassle until I
                found this tool. Highly recommend it for professionals!"
              </Typography>
            </Card>
          </Grid>
          {/* Testimonial 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  alt="User 3"
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">Emily Johnson</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Educator
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                "As a teacher, I often need to convert handwritten notes into
                digital format. This generator does it flawlessly!"
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Call-to-Action Section */}
      <Box
        sx={{
          mt: 12,
          mb: 6,
          padding: { xs: 3, md: 6 },
          textAlign: 'center',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(45deg, #1976d2, #dc004e)'
            : 'linear-gradient(45deg, #90caf9, #f48fb1)',
          color: '#fff',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.1)',
            transform: 'skewY(-5deg)',
          },
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Simplify Your Workflow?
        </Typography>
        <Typography variant="h6" gutterBottom>
          Start using our Image to Text Generator today and experience
          efficiency like never before.
        </Typography>
        {/* Updated Button: Navigates to Login Page */}
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="secondary"
          size="large"
        >
          Try It Now
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
