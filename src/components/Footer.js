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
      <Toolbar sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1.5, md: 2 } }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          alignItems={{ xs: 'center', md: 'center' }} 
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ flex: 1, width: "100%" }}
        >
          {/* Left Section - App Info */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1}
            sx={{ 
              justifyContent: { xs: 'center', md: 'flex-start' },
              flexWrap: 'wrap'
            }}
          >
            <CodeIcon sx={{ color: '#007AFF', fontSize: { xs: 16, md: 20 } }} />
            <Typography
              variant="body2"
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}
            >
              Hecho con
            </Typography>
            <FavoriteIcon sx={{ color: '#FF3B30', fontSize: { xs: 14, md: 16 } }} />
            <Typography
              variant="body2"
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', md: '0.875rem' }
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
              <Typography
                component="a"
                href="https://misintaxis5.wordpress.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                sx={{
                  color: '#007AFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  ml: 1,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                MiSintaxis
              </Typography>
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
            startIcon={<EmailIcon sx={{ fontSize: { xs: 16, md: 18 } }} />}
            sx={{
              color: '#007AFF',
              border: '1px solid #007AFF',
              borderRadius: 1.5,
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              fontWeight: 500,
              textTransform: 'none',
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.75, md: 1 },
              minWidth: { xs: 'auto', md: 'auto' },
              '&:hover': {
                backgroundColor: 'rgba(0, 122, 255, 0.04)',
                borderColor: '#0056CC'
              }
            }}
          >
            Contacto
          </Button>
        </Stack>

      </Toolbar>
    </AppBar>
  );
}

export default Footer;