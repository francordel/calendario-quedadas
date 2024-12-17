import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { calendarExists, createCalendar, checkCalendarPassword } from "../services/mockDatabase";

function Home() {
  const [name, setName] = useState("");
  const [calendarId, setCalendarId] = useState("");
  
  // Estados para diálogos
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Para distinguir si la contraseña es para crear o para acceder
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name || !calendarId) return; // Debe llenar ambos campos

    // Verificar si el calendario existe
    if (!calendarExists(calendarId)) {
      // Preguntar si desea crear
      setIsCreatingCalendar(true);
      setShowCreateDialog(true);
    } else {
      // Pedir contraseña para acceder
      setIsCreatingCalendar(false);
      setShowPasswordDialog(true);
    }
  };

  const handleCreateCalendar = () => {
    // Aquí ya está abierto el diálogo de confirmación para crear
    setShowCreateDialog(false); 
    // Ahora pediremos la contraseña para crear
    setShowPasswordDialog(true);
  };

  const handleCancelCreate = () => {
    setShowCreateDialog(false);
  };

  const handlePasswordConfirm = () => {
    if (isCreatingCalendar) {
      // Estamos creando el calendario
      if (!password || !confirmPassword) return;
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      // Creamos el calendario
      createCalendar(calendarId, password);
      setShowPasswordDialog(false);
      // Navegamos al calendario. Aquí podemos almacenar el nombre y userId.
      navigate(`/${calendarId}?name=${encodeURIComponent(name)}`);
    } else {
      // Estamos accediendo a un calendario existente
      if (!password) return;
      const valid = checkCalendarPassword(calendarId, password);
      if (!valid) {
        // Contraseña incorrecta
        setShowPasswordDialog(false);
        setShowErrorDialog(true);
      } else {
        setShowPasswordDialog(false);
        // Contraseña correcta, navegamos
        navigate(`/${calendarId}?name=${encodeURIComponent(name)}`);
      }
    }
  };

  const handleCloseError = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "99.9vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          backgroundImage: `url('/images/background.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.6)",
          zIndex: -1,
        }}
      />

      {/* Formulario */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          zIndex: 1,
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

      {/* Diálogo para preguntar si se desea crear el calendario */}
      <Dialog open={showCreateDialog} onClose={handleCancelCreate}>
        <DialogTitle>El calendario no existe</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Deseas crear un nuevo calendario con el ID "{calendarId}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate}>No</Button>
          <Button onClick={handleCreateCalendar} color="primary" variant="contained">Sí</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para pedir la contraseña */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>
          {isCreatingCalendar ? "Crea tu calendario" : "Introduce la contraseña"}
        </DialogTitle>
        <DialogContent>
          {isCreatingCalendar ? (
            <>
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirmar Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          ) : (
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancelar</Button>
          <Button onClick={handlePasswordConfirm} variant="contained" color="primary">
            {isCreatingCalendar ? "Crear" : "Acceder"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de error de contraseña */}
      <Dialog open={showErrorDialog} onClose={handleCloseError}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            La contraseña introducida es incorrecta.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseError} variant="contained" color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Home;
