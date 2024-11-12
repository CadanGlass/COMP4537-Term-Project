import React, { useContext } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { AuthContext } from "./Context/AuthContext";
import { useTheme } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import HistoryIcon from '@mui/icons-material/History';
import ApiIcon from '@mui/icons-material/Api';

function Dashboard() {
  const { auth } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
          borderRadius: 2,
          color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
            fontWeight: 600,
            mb: 4 
          }}
        >
          Welcome, {auth.username}!
        </Typography>

        <Grid container spacing={4}>
          {/* API Usage Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#2d2d2d',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <ApiIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ color: theme.palette.mode === 'light' ? '#333333' : '#ffffff' }}
                  >
                    API Usage
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3' }}
                >
                  Remaining API calls: 20
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#2d2d2d',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                    <HistoryIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ color: theme.palette.mode === 'light' ? '#333333' : '#ffffff' }}
                  >
                    Recent Activity
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3' }}
                >
                  No recent activity
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#2d2d2d',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#2e7d32', mr: 2 }}>
                    <ImageIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ color: theme.palette.mode === 'light' ? '#333333' : '#ffffff' }}
                  >
                    Images Processed
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3' }}
                >
                  0 images processed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Information */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#262626',
            borderRadius: 2,
            color: theme.palette.mode === 'light' ? '#333333' : '#ffffff',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ color: theme.palette.mode === 'light' ? '#333333' : '#ffffff' }}
          >
            Getting Started
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3',
              mb: 2 
            }}
          >
            To begin converting images to text:
          </Typography>
          <Box 
            component="ul" 
            sx={{ 
              pl: 2,
              color: theme.palette.mode === 'light' ? '#666666' : '#b3b3b3',
              '& li': {
                mb: 1,
              }
            }}
          >
            <li>Navigate to the Generator page</li>
            <li>Upload an image containing text</li>
            <li>Wait for the processing to complete</li>
            <li>Copy or download your extracted text</li>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Dashboard;
