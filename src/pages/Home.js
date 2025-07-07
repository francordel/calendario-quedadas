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
  Avatar,
  IconButton,
  Fade,
  Slide,
  Zoom,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Login as LoginIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ContentCopy as CopyIcon,
  Celebration as CelebrationIcon
} from "@mui/icons-material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCalendarId);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.02\"><circle cx=\"30\" cy=\"30\" r=\"1\"/></g></svg>')",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            py: 4,
          }}
        >
          
          {/* Left Side - Hero Content */}
          <Box flex={1} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Fade in timeout={800}>
              <Box>
                <Avatar
                  sx={{
                    width: { xs: 80, md: 120 },
                    height: { xs: 80, md: 120 },
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    margin: { xs: "0 auto 2rem", md: "0 0 2rem 0" },
                  }}
                >
                  <CalendarIcon sx={{ fontSize: { xs: 40, md: 60 }, color: "white" }} />
                </Avatar>
                
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    lineHeight: 1.1,
                    mb: 2,
                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Calendario de
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Quedadas
                  </Box>
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 400,
                    mb: 4,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Organiza reuniones de forma elegante y eficiente. 
                  Coordina disponibilidades con tu equipo de manera visual e intuitiva.
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Right Side - Action Cards */}
          <Box flex={1} sx={{ width: "100%", maxWidth: 500 }}>
            <Slide direction={isMobile ? "up" : "left"} in timeout={1000}>
              <Stack spacing={3}>
                
                {/* Create Calendar Card */}
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 60px rgba(31, 38, 135, 0.4)",
                      background: "rgba(255, 255, 255, 1)",
                    },
                  }}
                  onClick={handleCreateCalendarClick}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          width: 56,
                          height: 56,
                        }}
                      >
                        <AddIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Crear Calendario
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Genera un nuevo calendario con ID único automáticamente
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Login Card */}
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 60px rgba(31, 38, 135, 0.4)",
                      background: "rgba(255, 255, 255, 1)",
                    },
                  }}
                  onClick={handleLoginClick}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                          width: 56,
                          height: 56,
                        }}
                      >
                        <LoginIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Unirse a Calendario
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Accede a un calendario existente con su ID
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                
              </Stack>
            </Slide>
          </Box>
        </Box>
      </Container>

      {/* Create Calendar Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => handleDialogClose(setShowCreateDialog)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 60px rgba(31, 38, 135, 0.3)",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <AddIcon />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
                Crear Nuevo Calendario
              </Typography>
            </Stack>
            <IconButton onClick={() => handleDialogClose(setShowCreateDialog)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Introduce tu nombre para crear un nuevo calendario. Se generará automáticamente un ID único.
          </Typography>
          
          <TextField
            label="Tu Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
          />
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowCreateDialog)} 
            disabled={isLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCalendarSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              },
            }}
          >
            {isLoading ? "Creando..." : "Crear Calendario"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Dialog */}
      <Dialog 
        open={showLoginDialog} 
        onClose={() => handleDialogClose(setShowLoginDialog)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 60px rgba(31, 38, 135, 0.3)",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                <LoginIcon />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
                Unirse a Calendario
              </Typography>
            </Stack>
            <IconButton onClick={() => handleDialogClose(setShowLoginDialog)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Introduce tu nombre y el ID del calendario al que deseas acceder.
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label="Tu Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#4facfe",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4facfe",
                  },
                },
              }}
            />
            
            <TextField
              label="ID del Calendario"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              placeholder="ejemplo: amazing-calendar-123"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#4facfe",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4facfe",
                  },
                },
              }}
            />
          </Stack>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowLoginDialog)} 
            disabled={isLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleLoginSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim() || !calendarId.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              borderRadius: 2,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)",
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
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 60px rgba(31, 38, 135, 0.3)",
          }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              margin: "0 auto 1rem",
            }}
          >
            <CelebrationIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" fontWeight={700} color="primary">
            ¡Calendario Creado!
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: "center", pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Tu nuevo calendario se ha creado exitosamente.
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
                  ID del Calendario
                </Typography>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                  {generatedCalendarId}
                </Typography>
              </Box>
              <IconButton
                onClick={copyToClipboard}
                sx={{
                  color: "white",
                  "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <CopyIcon />
              </IconButton>
            </Stack>
          </Paper>
          
          <Typography variant="body2" color="text.secondary">
            Comparte este ID con otras personas para que puedan acceder al calendario.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button 
            onClick={handleSuccessDialogClose} 
            variant="contained"
            size="large"
            startIcon={<CheckCircleIcon />}
            sx={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              borderRadius: 2,
              px: 4,
              "&:hover": {
                background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
              },
            }}
          >
            Ir al Calendario
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
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