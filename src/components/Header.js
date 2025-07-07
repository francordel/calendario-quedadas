import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Stack,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E5E5EA',
        color: '#1C1C1E',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1.5, minHeight: '72px' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.2s ease'
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#007AFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
              }}
            >
              <CalendarIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#1C1C1E',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
              }}
            >
              Calendario de Quedadas
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Navigation */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: isHomePage ? '#007AFF' : '#8E8E93',
                fontWeight: 500,
                textTransform: 'none',
                px: 2,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: '#007AFF',
                },
              }}
            >
              Inicio
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#E5E5EA' }} />

            <Button
              startIcon={<InfoIcon />}
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                textTransform: 'none',
                px: 2,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: '#007AFF',
                },
              }}
            >
              Acerca de
            </Button>

            <Button
              startIcon={<HelpIcon />}
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                textTransform: 'none',
                px: 2,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: '#007AFF',
                },
              }}
            >
              Ayuda
            </Button>
          </Stack>

          {/* Developer Section */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#E5E5EA' }} />
            
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                alt="Fran Cortés"
                src="/images/FranCortes2.jpeg"
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: '2px solid #E5E5EA'
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#8E8E93',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                by Fran Cortés-Delgado
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton
                href="https://www.linkedin.com/in/francisco-jose-cortes-delgado/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#8E8E93',
                  width: 32,
                  height: 32,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 122, 255, 0.04)',
                    color: '#007AFF' 
                  }
                }}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </IconButton>

              <IconButton
                href="https://github.com/francordel"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#8E8E93',
                  width: 32,
                  height: 32,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 122, 255, 0.04)',
                    color: '#007AFF' 
                  }
                }}
              >
                <GitHubIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                color: isHomePage ? '#007AFF' : '#8E8E93',
                '&:hover': { backgroundColor: 'rgba(0, 122, 255, 0.04)' },
              }}
            >
              <HomeIcon />
            </IconButton>
          </Box>
        </Stack>

        {/* Version Badge */}
        <Chip
          label="v1.0"
          size="small"
          sx={{
            backgroundColor: '#F0F9FF',
            color: '#007AFF',
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 24,
            border: '1px solid #007AFF',
            ml: 2,
            display: { xs: 'none', sm: 'inline-flex' }
          }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Header;

