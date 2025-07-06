import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Footer() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: "#1976d2",
        mt: 2,
      }}
    >
      <Toolbar>
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            fontSize: { xs: "0.8rem", sm: "1.2rem", md: "1.5rem" }
          }}
        >
          Descarga{" "}
          <a
            href="https://misintaxis5.wordpress.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", textDecoration: "underline" }}
          >
            MiSintaxis
          </a>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            href="mailto:fran.j.cordel@gmail.com"
            sx={{
              color: "white",
              border: "1px solid white",
              fontSize: { xs: "0.7rem", sm: "0.9rem", md: "1rem" },
              padding: { xs: "4px 8px", sm: "6px 16px" },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            ¿Quieres publicitarte?
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;