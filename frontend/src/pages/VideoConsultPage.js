import React from 'react';
import { Container, Typography, Paper, Button, Grid } from '@mui/material';
import { VideoCall } from '@mui/icons-material';

function VideoConsultPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom align="center">
        Video Consultation
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Book Appointment</Typography>
            <Typography paragraph>
              Schedule a video consultation with Dr. Jimmy from anywhere in the world.
            </Typography>
            <Button variant="contained" startIcon={<VideoCall />}>
              Book Now
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Your Upcoming Meetings</Typography>
            <Typography color="textSecondary">No upcoming meetings scheduled.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default VideoConsultPage;