import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';

function AboutPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom align="center">
        About Dr. Jimmy
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="body1" paragraph>
          Dr. Jimmy is an internationally trained orthopedic and spine surgeon with over 15 years of experience.
          He specializes in complex spinal disorders, joint replacement, and trauma surgery.
        </Typography>
        <Typography variant="body1" paragraph>
          Fluent in English and Kiswahili, Dr. Jimmy is committed to providing world-class orthopedic care
          to patients across East Africa and beyond, especially those who cannot travel for consultations.
        </Typography>
      </Paper>
    </Container>
  );
}

export default AboutPage;

