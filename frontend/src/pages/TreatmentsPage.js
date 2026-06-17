import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

function TreatmentsPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom align="center">
        Our Treatments
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Spinal Cord Surgery</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Advanced surgical techniques for herniated discs, spinal stenosis, fractures, and tumors.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Orthopedic Bone Repair</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Fracture repair, joint replacement, and trauma surgery for all major joints.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TreatmentsPage;

