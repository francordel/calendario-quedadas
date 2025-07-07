import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from "@mui/material";
import { calendarExists, createCalendar, generateUniqueCalendarId } from "../services";

function Home() {
  const [name, setName] = useState("");
  const [calendarId, setCalendarId] = useState("");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedCalendarId, setGeneratedCalendarId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleCreateCalendarClick = () => {
    setShowCreateDialog(true);
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleCreateCalendarSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage("Por favor, introduce tu nombre");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Generate a unique calendar ID
      const idResult = await generateUniqueCalendarId();
      
      if (!idResult.success) {
        setErrorMessage(idResult.error || "Error al generar ID único");
        setIsLoading(false);
        return;
      }

      // Create the calendar
      const createResult = await createCalendar(idResult.calendarId);
      
      if (!createResult.success) {
        setErrorMessage(createResult.error || "Error al crear el calendario");
        setIsLoading(false);
        return;
      }

      // Success!
      setGeneratedCalendarId(idResult.calendarId);
      setShowCreateDialog(false);
      setShowSuccessDialog(true);
      setIsLoading(false);

    } catch (error) {
      console.error("Error creating calendar:", error);
      setErrorMessage("Error inesperado al crear el calendario");
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!name.trim() || !calendarId.trim()) {
      setErrorMessage("Por favor, introduce tu nombre y el ID del calendario");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const exists = await calendarExists(calendarId);
      if (!exists) {
        setErrorMessage("El calendario no existe. Verifica el ID o crea un nuevo calendario.");
        setIsLoading(false);
        return;
      }

      // Calendar exists, navigate to it
      navigate(`/${calendarId}?name=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error("Error checking calendar:", error);
      setErrorMessage("Error al verificar el calendario");
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate to the created calendar
    navigate(`/${generatedCalendarId}?name=${encodeURIComponent(name)}`);
  };

  const resetForm = () => {
    setName("");
    setCalendarId("");
    setErrorMessage("");
    setGeneratedCalendarId("");
    setIsLoading(false);
  };

  const handleDialogClose = (dialogSetter) => {
    dialogSetter(false);
    resetForm();
  };

  const handleCloseError = () => {
    setShowErrorDialog(false);
    setErrorMessage("");
  };

  return (
    <Box sx={{
      height: "100vh",
      width: "99.9vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
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
          Elige una opción para comenzar:
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCalendarClick}
          sx={{ width: "100%", marginBottom: 2 }}
        >
          Crear Calendario
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLoginClick}
          sx={{ width: "100%" }}
        >
          Ingresar a Calendario Existente
        </Button>
      </Box>

      <Dialog open={showCreateDialog} onClose={() => handleDialogClose(setShowCreateDialog)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Calendario</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Introduce tu nombre para crear un nuevo calendario. Se generará automáticamente un ID único.
          </Typography>
          <TextField
            label="Tu Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2, marginTop: 1 }}
            disabled={isLoading}
          />
          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(setShowCreateDialog)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCalendarSubmit} 
            variant="contained" 
            color="primary"
            disabled={isLoading || !name.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Creando..." : "Crear Calendario"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showLoginDialog} onClose={() => handleDialogClose(setShowLoginDialog)} maxWidth="sm" fullWidth>
        <DialogTitle>Ingresar a Calendario Existente</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Introduce tu nombre y el ID del calendario al que deseas acceder.
          </Typography>
          <TextField
            label="Tu Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2, marginTop: 1 }}
            disabled={isLoading}
          />
          <TextField
            label="ID del Calendario"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={isLoading}
            placeholder="ejemplo: amazing-calendar-123"
          />
          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(setShowLoginDialog)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleLoginSubmit} 
            variant="contained" 
            color="primary"
            disabled={isLoading || !name.trim() || !calendarId.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Verificando..." : "Ingresar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSuccessDialog} onClose={handleSuccessDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>¡Calendario Creado!</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Tu nuevo calendario se ha creado exitosamente.
          </Typography>
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            <strong>ID del Calendario:</strong> {generatedCalendarId}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Comparte este ID con otras personas para que puedan acceder al calendario.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} variant="contained" color="primary">
            Ir al Calendario
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={showErrorDialog} onClose={handleCloseError}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {errorMessage || "Ha ocurrido un error inesperado."}
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

