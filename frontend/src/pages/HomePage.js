import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import { CloudUpload, VideoCall, Healing, LocalHospital } from '@mui/icons-material';

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: '#1976d2', 
        color: 'white', 
        py: 12,
        backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                {t('hero.title')}
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                {t('hero.subtitle')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<CloudUpload />}
                  onClick={() => navigate('/upload')}
                  sx={{ bgcolor: 'white', color: '#1976d2' }}
                >
                  {t('hero.upload')}
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<VideoCall />}
                  onClick={() => navigate('/video-consult')}
                  sx={{ borderColor: 'white', color: 'white' }}
                >
                  {t('hero.consult')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                width: '100%', 
                height: 300, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h5">Dr. Jimmy</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Our Expert Services
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Healing sx={{ fontSize: 60, color: '#1976d2' }} />
              <Typography variant="h5" sx={{ mt: 2 }}>{t('treatments.spine.title')}</Typography>
              <Typography variant="body2" color="textSecondary">{t('treatments.spine.desc')}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <LocalHospital sx={{ fontSize: 60, color: '#1976d2' }} />
              <Typography variant="h5" sx={{ mt: 2 }}>{t('treatments.ortho.title')}</Typography>
              <Typography variant="body2" color="textSecondary">{t('treatments.ortho.desc')}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <VideoCall sx={{ fontSize: 60, color: '#1976d2' }} />
              <Typography variant="h5" sx={{ mt: 2 }}>{t('treatments.tele.title')}</Typography>
              <Typography variant="body2" color="textSecondary">{t('treatments.tele.desc')}</Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;




