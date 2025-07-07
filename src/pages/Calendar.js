import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { 
  Button, 
  Typography, 
  Box, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Chip,
  Stack,
  IconButton,
  Paper,
  Fade,
  Slide,
  Avatar,
  Container,
  Zoom,
  Divider
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from "@mui/icons-material";
import "./Calendar.css";

// Importamos las funciones de utilidad
import { generateEvents, eventStyleGetter, dayPropGetter } from './CalendarUtils';
import Recommendation from '../components/Recommendation';
import { saveUserSelections } from '../services';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

function Calendar() {
  const { calendarId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userName = queryParams.get('name');
  const [selectedDays, setSelectedDays] = useState({ green: [], red: [], orange: [] });
  const [events, setEvents] = useState([]);
  const [step, setStep] = useState(1);
  const [popupDate, setPopupDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelectSlot = ({ start }) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (start >= today) {
      setPopupDate(start);
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setPopupDate(null);
    setOpenDialog(false);
  };

  const handleDaySelection = (type) => {
    setSelectedDays((prev) => {
      const updated = { ...prev };
      const dateStr = popupDate.toDateString();

      // Eliminar la fecha de todos los estados previos
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((day) => day !== dateStr);
      });

      updated[type].push(dateStr);
      const updatedEvents = generateEvents(updated, handleEventClick);
      setEvents(updatedEvents);

      return updated;
    });
    handleDialogClose();
  };

  const handleEventClick = (eventDate) => {
    setPopupDate(eventDate);
    setOpenDialog(true);
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        setIsLoading(true);
        await saveUserSelections(userName, calendarId, selectedDays);
        setShowRecommendation(true);
      } catch (error) {
        console.error("Error al guardar las selecciones:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: 3,
              mb: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <CalendarIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box flex={1}>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0.5
                  }}
                >
                  {calendarId}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {userName}
                  </Typography>
                </Stack>
              </Box>
              
              <IconButton
                onClick={handleBack}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Paso {step} de 2
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step === 1 
                    ? "Selecciona tu disponibilidad para cada día" 
                    : "Revisa y confirma tus selecciones"}
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip 
                  icon={<CheckIcon />} 
                  label="Disponible" 
                  size="small"
                  sx={{ 
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: "white" }
                  }} 
                />
                <Chip 
                  icon={<CancelIcon />} 
                  label="No disponible" 
                  size="small"
                  sx={{ 
                    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    color: "white",
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: "white" }
                  }} 
                />
                <Chip 
                  icon={<HelpIcon />} 
                  label="Quizás" 
                  size="small"
                  sx={{ 
                    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: "white" }
                  }} 
                />
              </Stack>
            </Box>
          </Paper>
        </Fade>

        {/* Calendar Section */}
        <Slide direction="up" in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              height: { xs: "400px", sm: "550px", md: "700px" },
              borderRadius: 6,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 60px rgba(31, 38, 135, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 30px 80px rgba(31, 38, 135, 0.4)",
              },
            }}
          >
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              views={["month"]}
              style={{
                height: "100%",
                width: "100%",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={dayPropGetter}
              components={{
                toolbar: (props) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 24px",
                        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                      }}
                    >
                      <IconButton
                        onClick={() => props.onNavigate("PREV")}
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <NavigateBeforeIcon />
                      </IconButton>
                      
                      <Typography
                        variant="h5"
                        sx={{ 
                          textAlign: "center", 
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          cursor: "pointer",
                          userSelect: "none"
                        }}
                      >
                        {props.label}
                      </Typography>

                      <IconButton
                        onClick={() => props.onNavigate("NEXT")}
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          width: 48,
                          height: 48,
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <NavigateNextIcon />
                      </IconButton>
                    </Box>
                  );
                },
              }}
            />
          </Paper>
        </Slide>

        {/* Action Buttons */}
        <Zoom in timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
            }}
          >
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="outlined"
                size="large"
                onClick={handleBack}
                sx={{
                  borderColor: "rgba(102, 126, 234, 0.5)",
                  color: "#667eea",
                  fontWeight: 600,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#667eea",
                    background: "rgba(102, 126, 234, 0.05)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {step === 1 ? "Volver al inicio" : "Paso anterior"}
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={isLoading}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 600,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(135deg, #a0aec0 0%, #718096 100%)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {isLoading ? "Guardando..." : step === 1 ? "Continuar" : "Finalizar"}
              </Button>
            </Stack>
          </Paper>
        </Zoom>

        {/* Premium Day Selection Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleDialogClose} 
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
          <DialogTitle sx={{ 
            textAlign: "center", 
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            pb: 1
          }}>
            {popupDate ? format(popupDate, "EEEE, dd 'de' MMMM", { locale: es }) : ""}
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              ¿Cuál es tu disponibilidad para este día?
            </Typography>
            
            <Stack spacing={2}>
              <Button 
                onClick={() => handleDaySelection("green")} 
                fullWidth 
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(79, 172, 254, 0.4)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Disponible
              </Button>
              
              <Button 
                onClick={() => handleDaySelection("orange")} 
                fullWidth 
                variant="contained"
                startIcon={<HelpIcon />}
                sx={{
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(67, 233, 123, 0.4)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Quizás (requiere esfuerzo)
              </Button>
              
              <Button 
                onClick={() => handleDaySelection("red")} 
                fullWidth 
                variant="contained"
                startIcon={<CancelIcon />}
                sx={{
                  background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(250, 112, 154, 0.4)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                No disponible
              </Button>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleDialogClose} 
              sx={{ 
                color: "text.secondary",
                "&:hover": { background: "rgba(0,0,0,0.04)" }
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Recommendation Component */}
        {showRecommendation && (
          <Recommendation 
            calendarId={calendarId}
            currentUserName={userName}
            currentUserSelections={selectedDays}
            onClose={() => setShowRecommendation(false)}
          />
        )}
        
      </Container>
    </Box>
  );
}

export default Calendar;