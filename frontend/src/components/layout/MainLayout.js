import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { logout } from '../../store/authSlice';

function MainLayout() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Dr. Jimmy Orthopedic & Spine
          </Typography>
          
          <Button color="inherit" component={Link} to="/">{t('nav.home')}</Button>
          <Button color="inherit" component={Link} to="/treatments">{t('nav.treatments')}</Button>
          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/upload">{t('nav.upload')}</Button>
              <Button color="inherit" component={Link} to="/video-consult">{t('nav.video')}</Button>
            </>
          )}
          <Button color="inherit" component={Link} to="/about">{t('nav.about')}</Button>
          
          <IconButton color="inherit" onClick={handleLanguageClick}>
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleLanguageClose('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLanguageClose('sw')}>Kiswahili</MenuItem>
          </Menu>
          
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>{t('nav.logout')}</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">{t('nav.login')}</Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Outlet />
      
      <Box component="footer" sx={{ bgcolor: '#333', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2024 Dr. Jimmy Orthopedic & Spine Center. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Emergency? Please visit your nearest hospital immediately.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default MainLayout;

