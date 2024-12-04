import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

function Home() {
  const [name, setName] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (name && calendarId) {
      navigate(`/${calendarId}`);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "99.9vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Centrado vertical y horizontal
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo con imagen */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url('/images/background.webp')`, // Reemplaza con tu archivo
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.6)", // Oscurece el fondo
          zIndex: -1, // Mueve la imagen detrás del contenido
        }}
      />

      {/* Formulario */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo blanco semitransparente
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          maxWidth: "400px", // Limita el ancho del formulario
          width: "100%",
          zIndex: 1, // Asegura que el formulario esté sobre la imagen
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido al Calendario de Quedadas
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 4 }}>
          Introduce tu nombre y el ID del calendario para comenzar.
        </Typography>
        <TextField
          label="Tu Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2, width: "100%" }}
        />
        <TextField
          label="ID del Calendario"
          value={calendarId}
          onChange={(e) => setCalendarId(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2, width: "100%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ width: "100%" }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
