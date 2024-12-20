import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./Calendar.css";

// Importamos las funciones de utilidad
import { generateEvents, eventStyleGetter, dayPropGetter } from './CalendarUtils';
import Recommendation from '../components/Recommendation';  // Ajusta la ruta según tu estructura de carpetas
import { saveUserSelections } from '../services/firebaseDatabase';  // Ajusta la ruta según tu estructura de archivos

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
  const navigate = useNavigate();

  const handleSelectSlot = ({ start }) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (start >= today) {
      setPopupDate(start);
      setOpenDialog(true); // Abrir el diálogo cuando se selecciona un día
    }
  };

  const handleDialogClose = () => {
    setPopupDate(null);
    setOpenDialog(false);
  };

  const handleDaySelection = (type) => {
    console.log("dia seleccionado");
    setSelectedDays((prev) => {
      const updated = { ...prev };
      const dateStr = popupDate.toDateString();

      // Eliminar la fecha de todos los estados previos
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((day) => day !== dateStr);
      });

      updated[type].push(dateStr); // Añadir al estado seleccionado
      const updatedEvents = generateEvents(updated, handleEventClick);
      setEvents(updatedEvents);

      return updated;
    });
    handleDialogClose();
  };

  const handleEventClick = (eventDate) => {
    console.log("Evento clickeado:", eventDate); // Esto debería mostrarse en la consola
    setPopupDate(eventDate); // Establece la fecha del evento en el popup
    setOpenDialog(true); // Abre el popup
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        // Esperamos a que se complete el guardado antes de mostrar la recomendación
        await saveUserSelections(userName, calendarId, selectedDays);
        setShowRecommendation(true);
      } catch (error) {
        console.error("Error al guardar las selecciones:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "auto",
        padding: "3px",
        paddingTop: { xs: "20px", sm: "30px", md: "40px" },
        paddingBottom: { xs: "3px", sm: "200px", md: "330px" },
        backgroundColor: "#e7f2f6",
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          marginBottom: "1.5rem",
          textAlign: "center",
          width: "100%",
          whiteSpace: { xs: 'pre-line', sm: 'nowrap' },
          '& > *': {
            textAlign: 'center'
          }
        }}
      >
        {`Calendario: ${calendarId}`}
      </Typography>
      <Typography 
        variant="body1" 
        gutterBottom
        sx={{
          marginBottom: "1.5rem",
          textAlign: "center",
          width: "100%"
        }}
      >
        Paso {step === 1 ? "1: Selecciona tus días disponibles (Sí, NO, '?' Significa esfuerzo)" : "2: Revisa tus días seleccionados '?' Significa esfuerzo"}
      </Typography>

      <Box
        sx={{
          height: { xs: "350px", sm: "500px", md: "650px" },
          width: { xs: "94%", sm: "90%", md: "70%" },
          maxWidth: "900px",
          alignSelf: "center",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          views={["month"]} // Solo muestra la vista de mes
          style={{
            height: "100%", // Altura por defecto
            width: "100%", // Ajusta al contenedor padre
            fontSize: "14px", // Tamaño de texto más pequeño para pantallas pequeñas
          }}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter} // Aplica estilo a todos los días
          components={{
            toolbar: (props) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 16px",
                  }}
                >
                  <Button
                    onClick={() => props.onNavigate("PREV")}
                    sx={{
                      fontSize: "18px",
                      backgroundColor: "#E0F7FA",
                      borderRadius: "50%",
                      minWidth: "40px",
                      height: "40px",
                    }}
                  >
                    ←
                  </Button>
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "center", cursor: "pointer" }}
                  >
                    {props.label} {/* Esto muestra el mes y año */}
                  </Typography>

                  <Button
                    onClick={() => props.onNavigate("NEXT")}
                    sx={{
                      fontSize: "18px",
                      backgroundColor: "#E0F7FA",
                      borderRadius: "50%",
                      minWidth: "40px",
                      height: "40px",
                    }}
                  >
                    →
                  </Button>
                </Box>
              );
            },
          }}
        />
      </Box>

      {/* Aquí viene el nuevo diálogo */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        {/* Título con la fecha formateada */}
        <DialogTitle>
          ¿Puedes quedar el {popupDate ? format(popupDate, "dd/MM/yyyy") : ""}
        </DialogTitle>
        <DialogContent>
          <Button onClick={() => handleDaySelection("green")} fullWidth color="success">
            Sí
          </Button>
          <Button onClick={() => handleDaySelection("red")} fullWidth color="error">
            No
          </Button>
          <Button onClick={() => handleDaySelection("orange")} fullWidth color="warning">
            ?
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Añadir aquí el componente Recommendation */}
      {showRecommendation && (
        <Recommendation 
          calendarId={calendarId}
          currentUserName={userName}  // Pasamos el nombre del usuario
          currentUserSelections={selectedDays}
          onClose={() => setShowRecommendation(false)}
        />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          marginTop: 2,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/')}
        >
          Volver
        </Button>
        <Button variant="contained" color="primary" onClick={handleContinue}>
          {step === 1 ? "Continuar" : "Terminar"}
        </Button>
      </Box>
    </Box>
  );
}

export default Calendar;
