import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert, 
  CircularProgress,
  Container,
  Paper,
  Stack,
  IconButton,
  Divider
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Login as LoginIcon
} from "@mui/icons-material";
import { calendarExists, createCalendar, generateUniqueCalendarId } from "../services";

function Home() {
  const [name, setName] = useState("");
  const [calendarId, setCalendarId] = useState("");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCalendarId);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 4, md: 8 },
          }}
        >
          
          {/* Hero Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                fontWeight: 700,
                color: "#1C1C1E",
                lineHeight: 1.1,
                mb: 2,
                letterSpacing: "-0.02em",
              }}
            >
              Calendario de Quedadas
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: "#8E8E93",
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
                mb: 6,
              }}
            >
              Coordina reuniones de manera eficiente. Simplifica la organización de eventos 
              compartiendo disponibilidades con tu equipo.
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateCalendarClick}
              sx={{
                backgroundColor: "#007AFF",
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "#0056CC",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
                },
                minWidth: 200,
              }}
            >
              Crear Calendario
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              sx={{
                borderColor: "#007AFF",
                color: "#007AFF",
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#0056CC",
                  backgroundColor: "rgba(0, 122, 255, 0.04)",
                },
                minWidth: 200,
              }}
            >
              Unirse a Calendario
            </Button>
          </Stack>

          {/* Feature Highlights */}
          <Box sx={{ mt: 8 }}>
            <Stack 
              direction={{ xs: "column", md: "row" }} 
              spacing={4}
              justifyContent="center"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "white",
                  border: "1px solid #E5E5EA",
                  borderRadius: 2,
                  textAlign: "center",
                  flex: 1,
                  maxWidth: 280,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1C1C1E" }}>
                  Sin contraseñas
                </Typography>
                <Typography variant="body2" color="#8E8E93">
                  Acceso simple con IDs únicos generados automáticamente
                </Typography>
              </Paper>
              
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "white",
                  border: "1px solid #E5E5EA",
                  borderRadius: 2,
                  textAlign: "center",
                  flex: 1,
                  maxWidth: 280,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1C1C1E" }}>
                  Interfaz intuitiva
                </Typography>
                <Typography variant="body2" color="#8E8E93">
                  Diseño limpio y profesional optimizado para cualquier dispositivo
                </Typography>
              </Paper>
              
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "white",
                  border: "1px solid #E5E5EA",
                  borderRadius: 2,
                  textAlign: "center",
                  flex: 1,
                  maxWidth: 280,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1C1C1E" }}>
                  Resultados inmediatos
                </Typography>
                <Typography variant="body2" color="#8E8E93">
                  Visualiza disponibilidades y encuentra la mejor fecha al instante
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Create Calendar Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => handleDialogClose(setShowCreateDialog)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Crear Nuevo Calendario
            </Typography>
            <IconButton 
              onClick={() => handleDialogClose(setShowCreateDialog)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 3 }}>
            Introduce tu nombre para crear un nuevo calendario. Se generará automáticamente un ID único que podrás compartir.
          </Typography>
          
          <TextField
            label="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover fieldset": {
                  borderColor: "#007AFF",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#007AFF",
                },
              },
            }}
          />
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowCreateDialog)} 
            disabled={isLoading}
            sx={{ 
              color: "#8E8E93",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCalendarSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 3,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056CC",
              },
              "&:disabled": {
                backgroundColor: "#C7C7CC",
              },
            }}
          >
            {isLoading ? "Creando..." : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Dialog */}
      <Dialog 
        open={showLoginDialog} 
        onClose={() => handleDialogClose(setShowLoginDialog)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Unirse a Calendario
            </Typography>
            <IconButton 
              onClick={() => handleDialogClose(setShowLoginDialog)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 3 }}>
            Introduce tu nombre y el ID del calendario al que deseas acceder.
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
            
            <TextField
              label="ID del calendario"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              placeholder="ejemplo: amazing-calendar-123"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
          </Stack>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowLoginDialog)} 
            disabled={isLoading}
            sx={{ 
              color: "#8E8E93",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleLoginSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim() || !calendarId.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 3,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056CC",
              },
              "&:disabled": {
                backgroundColor: "#C7C7CC",
              },
            }}
          >
            {isLoading ? "Verificando..." : "Unirse"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleSuccessDialogClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
          <Typography variant="h5" fontWeight={700} color="#1C1C1E" sx={{ mb: 1 }}>
            ¡Calendario creado!
          </Typography>
          <Typography variant="body2" color="#8E8E93">
            Tu calendario se ha creado exitosamente
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: "center", pt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#F0F9FF",
              border: "1px solid #007AFF",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box textAlign="left">
                <Typography variant="body2" sx={{ color: "#007AFF", mb: 0.5, fontWeight: 500 }}>
                  ID del calendario
                </Typography>
                <Typography variant="h6" sx={{ color: "#1C1C1E", fontWeight: 600, fontFamily: "monospace" }}>
                  {generatedCalendarId}
                </Typography>
              </Box>
              <IconButton
                onClick={copyToClipboard}
                sx={{
                  color: "#007AFF",
                  backgroundColor: "rgba(0, 122, 255, 0.1)",
                  "&:hover": { backgroundColor: "rgba(0, 122, 255, 0.2)" },
                }}
              >
                <CopyIcon />
              </IconButton>
            </Stack>
          </Paper>
          
          <Typography variant="body2" color="#8E8E93">
            Comparte este ID con las personas que deseas invitar al calendario.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button 
            onClick={handleSuccessDialogClose} 
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 4,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056CC",
              },
            }}
          >
            Ir al calendario
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}

export default Home;