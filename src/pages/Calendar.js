import React, { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Paper,
  Container,
  Stack,
  Chip,
  Breadcrumbs,
  Link
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Home as HomeIcon
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
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSelectSlot = ({ start }) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (start >= today) {
      setPopupDate(start);
      setOpenDialog(true);
    }
  };

  // Handle single click on mobile and long press on desktop
  const handleDateClick = useCallback((event) => {
    if (isMobile) {
      event.preventDefault();
      const clickedElement = event.target.closest('.rbc-date-cell');
      if (clickedElement) {
        const dateButton = clickedElement.querySelector('.rbc-button-link');
        if (dateButton) {
          const dateText = dateButton.textContent;
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const selectedDate = new Date(currentYear, currentMonth, parseInt(dateText));
          
          const today = new Date().setHours(0, 0, 0, 0);
          if (selectedDate >= today) {
            setPopupDate(selectedDate);
            setOpenDialog(true);
          }
        }
      }
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      document.addEventListener('click', handleDateClick);
      return () => document.removeEventListener('click', handleDateClick);
    }
  }, [isMobile, handleDateClick]);

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

  const getSelectionCounts = () => {
    return {
      available: selectedDays.green.length,
      unavailable: selectedDays.red.length,
      maybe: selectedDays.orange.length
    };
  };

  const counts = getSelectionCounts();

  return (
    <Box
      sx={{
        flex: 1,
        position: "relative",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2, md: 3 },
            backgroundColor: "white",
            border: "1px solid #E5E5EA",
            borderRadius: 2,
          }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2, fontSize: 14 }} separator="›">
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#007AFF",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              <HomeIcon sx={{ fontSize: 16 }} />
              Inicio
            </Link>
            <Typography color="text.primary" variant="body2">
              {calendarId}
            </Typography>
          </Breadcrumbs>

          {/* Header Content */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "#1C1C1E",
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", md: "2.125rem" }
                }}
              >
                {calendarId}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PersonIcon sx={{ fontSize: 16, color: "#8E8E93" }} />
                <Typography variant="body2" color="#8E8E93">
                  {userName} • Paso {step} de 2
                </Typography>
              </Stack>
              <Typography variant="body1" color="#616161" sx={{ maxWidth: 600 }}>
                {step === 1 
                  ? "Selecciona tu disponibilidad haciendo clic en cada día. En móvil, simplemente toca el día." 
                  : "Revisa tus selecciones y finaliza cuando estés conforme."}
              </Typography>
            </Box>

            <IconButton
              onClick={handleBack}
              sx={{
                backgroundColor: "#F5F5F5",
                border: "1px solid #E0E0E0",
                "&:hover": {
                  backgroundColor: "#EEEEEE",
                  borderColor: "#BDBDBD",
                },
                width: 44,
                height: 44,
              }}
            >
              <ArrowBackIcon sx={{ color: "#424242" }} />
            </IconButton>
          </Stack>

          {/* Status Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              icon={<CheckIcon sx={{ fontSize: 16 }} />}
              label={`Disponible (${counts.available})`}
              size="small"
              sx={{
                backgroundColor: "#D4EDDA",
                color: "#155724",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#28A745" }
              }}
            />
            <Chip
              icon={<HelpIcon sx={{ fontSize: 16 }} />}
              label={`Quizás (${counts.maybe})`}
              size="small"
              sx={{
                backgroundColor: "#FFF3CD",
                color: "#856404",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#FF9500" }
              }}
            />
            <Chip
              icon={<CancelIcon sx={{ fontSize: 16 }} />}
              label={`No disponible (${counts.unavailable})`}
              size="small"
              sx={{
                backgroundColor: "#F8D7DA",
                color: "#721C24",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#FF3B30" }
              }}
            />
          </Stack>
        </Paper>

        {/* Calendar Section */}
        <Paper
          elevation={0}
          sx={{
            height: { xs: "500px", md: "600px", lg: "700px" },
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "white",
            border: "1px solid #E5E5EA",
            mb: 3,
          }}
        >
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable={!isMobile}
            onSelectSlot={!isMobile ? handleSelectSlot : undefined}
            views={["month"]}
            style={{
              height: "100%",
              width: "100%",
              fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
            }}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            components={{
              toolbar: (props) => {
                return (
                  <Box className="calendar-month-nav" sx={{ p: 3 }}>
                    <IconButton
                      className="calendar-nav-button"
                      onClick={() => props.onNavigate("PREV")}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    
                    <Typography className="calendar-month-title">
                      {props.label}
                    </Typography>

                    <IconButton
                      className="calendar-nav-button"
                      onClick={() => props.onNavigate("NEXT")}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                  </Box>
                );
              },
            }}
          />
        </Paper>

        {/* Action Buttons */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "white",
            border: "1px solid #E5E5EA",
            borderRadius: 2,
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
              disabled={isLoading}
              sx={{
                borderColor: "#007AFF",
                color: "#007AFF",
                fontWeight: 500,
                borderRadius: 1.5,
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "#0056CC",
                  backgroundColor: "rgba(0, 122, 255, 0.04)",
                },
                "&:disabled": {
                  borderColor: "#C7C7CC",
                  color: "#C7C7CC",
                },
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
                backgroundColor: "#007AFF",
                fontWeight: 500,
                borderRadius: 1.5,
                px: 4,
                py: 1.5,
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "#0056CC",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
                },
                "&:disabled": {
                  backgroundColor: "#C7C7CC",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Guardando..." : step === 1 ? "Continuar" : "Finalizar"}
            </Button>
          </Stack>
        </Paper>

        {/* Selection Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleDialogClose} 
          maxWidth="xs" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: "1px solid #E5E5EA",
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: "center", 
            fontWeight: 600,
            color: "#1C1C1E",
            pb: 1,
            borderBottom: "1px solid #F2F2F7"
          }}>
            {popupDate ? format(popupDate, "EEEE, dd 'de' MMMM", { locale: es }) : ""}
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Typography variant="body2" color="#8E8E93" textAlign="center" sx={{ mb: 3 }}>
              ¿Cuál es tu disponibilidad para este día?
            </Typography>
            
            <Stack spacing={2}>
              <Button 
                onClick={() => handleDaySelection("green")} 
                fullWidth 
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  backgroundColor: "#28A745",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#218838",
                  },
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
                  backgroundColor: "#FF9500",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#E68900",
                  },
                }}
              >
                Quizás
              </Button>
              
              <Button 
                onClick={() => handleDaySelection("red")} 
                fullWidth 
                variant="contained"
                startIcon={<CancelIcon />}
                sx={{
                  backgroundColor: "#FF3B30",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#E3342F",
                  },
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
                color: "#8E8E93",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" }
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