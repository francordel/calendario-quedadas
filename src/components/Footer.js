import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Stack, 
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Favorite as FavoriteIcon,
  Code as CodeIcon
} from '@mui/icons-material';

function Footer() {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #E5E5EA',
        color: '#1C1C1E',
        mt: 4,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          alignItems={{ xs: 'center', md: 'center' }} 
          spacing={2} 
          sx={{ flex: 1 }}
        >
          {/* Left Section - App Info */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <CodeIcon sx={{ color: '#007AFF', fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Hecho con
            </Typography>
            <FavoriteIcon sx={{ color: '#FF3B30', fontSize: 16 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              por Fran Cortés-Delgado
            </Typography>
          </Stack>

          <Box sx={{ flex: 1 }} />

          {/* Center Section - Links */}
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography
              variant="body2"
              sx={{
                color: '#8E8E93',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              ¿Tu empresa quiere publicitarse aquí?
            </Typography>

            <Divider orientation="vertical" flexItem sx={{ borderColor: '#E5E5EA' }} />

            <Typography
              variant="body2"
              sx={{
                color: '#C7C7CC',
                fontSize: '0.875rem'
              }}
            >
              © 2024 Calendario de Quedadas
            </Typography>
          </Stack>

          {/* Right Section - Contact */}
          <Button
            href="mailto:fran.j.cordel@gmail.com"
            startIcon={<EmailIcon />}
            sx={{
              color: '#007AFF',
              border: '1px solid #007AFF',
              borderRadius: 1.5,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 122, 255, 0.04)',
                borderColor: '#0056CC'
              }
            }}
          >
            Contacto
          </Button>
        </Stack>

        {/* Mobile Layout */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: '#8E8E93',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                ¿Tu empresa quiere publicitarse?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#C7C7CC',
                  fontSize: '0.75rem'
                }}
              >
                © 2024
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;