import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';

function DashboardPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Patient Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4">0</Typography>
            <Typography variant="body2">Uploaded Scans</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4">0</Typography>
            <Typography variant="body2">Consultations</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4">0</Typography>
            <Typography variant="body2">Reports Available</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;

