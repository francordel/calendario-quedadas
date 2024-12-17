import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>

        
        {/* Título principal alineado a la izquierda con enlace al Home */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontSize: { xs: "0.8rem", sm: "1.5rem", md: "1.75rem" }, // Tamaños según el tamaño de la pantalla
          }}
        >
         Mi Quedada
        </Typography>

        {/* Separador vertical */}
        
        <Box
          component="span"
          sx={{
            borderLeft: "1px solid white",
            height: "24px",
            margin: "0 16px",
          }}
        ></Box>
        {/* Imagen de Fran Cortés */}
        <IconButton
          href="https://linktr.ee/francordel.ia" 
          target="_blank"
          rel="noopener noreferrer"
          sx={{ padding: 0 }} // Quitar padding adicional de IconButton
        >
          <Avatar
            alt="Fran Cortés"
            src="/images/FranCortes2.jpeg"
            sx={{ marginRight: 2 }}
          />
        </IconButton>


        {/* Texto alineado a la derecha */}
        <Typography
          variant="body1" 
          component="div"
          sx={{
              fontSize: { xs: "0.8rem", sm: "1.2rem", md: "1.5rem" }, // Tamaños según el tamaño de la pantalla
            }}>
          by Fran Cortés-Delgado
        </Typography>
        {/* Iconos de LinkedIn y GitHub */}
               <IconButton
          href="https://www.linkedin.com/in/francisco-jose-cortes-delgado/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "white" }}
        >
          <img
            src="/images/logoLinkedin.png"
            alt="LinkedIn"
            style={{ width: "24px", height: "24px" }}
          />
        </IconButton>

        <IconButton
          href="https://github.com/francordel"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "white" }}
        >
          <img
            src="/images/logoGithub.png"
            alt="GitHub"
            style={{ width: "24px", height: "24px" }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

