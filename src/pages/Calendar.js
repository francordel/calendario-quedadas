import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Menu, MenuItem, Button, Typography, Box } from "@mui/material";
import "./Calendar.css";
import { orange } from "@mui/material/colors";

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
  const [selectedDays, setSelectedDays] = useState({ green: [], red: [], orange: [] });
  const [events, setEvents] = useState([]);
  const [step, setStep] = useState(1);
  const [popupDate, setPopupDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelectSlot = ({ start }) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (start >= today) {
      setPopupDate(start);
      setAnchorEl(document.body);
    }
  };

  const handleMenuClose = () => {
    setPopupDate(null);
    setAnchorEl(null);
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    const isPast = date < today.setHours(0, 0, 0, 0); // Verifica si es día pasado
  
    return {
      style: {
        backgroundColor: isPast ? "#d3d3d3" : "white", // Gris para días pasados
        color: isPast ? "#9e9e9e" : "black", // Texto gris claro para días pasados
        pointerEvents: isPast ? "none" : "auto", // Deshabilita interacción para días pasados
      },
    };
  };

  const handleDaySelection = (type) => {
    setSelectedDays((prev) => {
      const updated = { ...prev };
      const dateStr = popupDate.toDateString();

      // Eliminar la fecha de todos los estados previos
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((day) => day !== dateStr);
      });

      updated[type].push(dateStr); // Añadir al estado seleccionado
    

      // Actualizar eventos visuales
      const updatedEvents = generateEvents(updated);
      setEvents(updatedEvents);

      return updated;
    });
    handleMenuClose();
  };

  const handleContinue = () => {
    if (step === 1) {
      // Marcar automáticamente los días no seleccionados como "?"
      const allDays = getAllDaysInNextYears();
      const selectedDates = [...selectedDays.green, ...selectedDays.red];
      const unselectedDays = allDays.filter(
        (day) => !selectedDates.includes(day.toDateString())
      );
  
      // Actualizar el estado de selectedDays primero
      const updatedSelectedDays = {
        ...selectedDays,
        orange: unselectedDays.map((day) => day.toDateString()), // Marcar como "?"
      };
  
      setSelectedDays(updatedSelectedDays);
  
      // Luego generar eventos basados en el nuevo estado
      const updatedEvents = generateEvents(updatedSelectedDays);
      setEvents(updatedEvents);
  
      setStep(2);
    } else {
      console.log("Flujo terminado con los días seleccionados:", selectedDays);
    }
  };
  
  const generateEvents = (days) => {
    const newEvents = [];
    Object.entries(days).forEach(([key, dates]) => {
      dates.forEach((date) => {
        newEvents.push({
          start: new Date(date),
          end: new Date(date),
          title: key === "green" ? "Sí" : key === "red" ? "No" : "?",
          color: key === "green" ? "#A5D6A7" : key === "red" ? "#EF9A9A" : "#FFE082",
        });
      });
    });
    return newEvents;
  };

  const getAllDaysInNextYears = () => {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const end = new Date(start.getFullYear()+4, start.getMonth() + 1, 0);
    const days = [];
    let current = new Date(start);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const eventStyleGetter = (event) => {
    const today = new Date();
    const eventDate = new Date(event.start);
    const isPast = eventDate < today.setHours(0, 0, 0, 0);

    const style = {
      backgroundColor: isPast ? "#d3d3d3" : event.color,
      color: isPast ? "#9e9e9e" : "white",
      borderRadius: "10px",
      border: "none",
      display: "block",
      padding: "5px",
      pointerEvents: isPast ? "none" : "auto",
    };

    return { style };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        padding: 0,
        backgroundColor: "#e7f2f6",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Calendario: {calendarId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Paso {step === 1 ? "1: Selecciona tus días disponibles" : "2: Revisa tus días seleccionados"}
      </Typography>

      <Box
        sx={{
          height: { xs: "55%", sm: "70%", md: "70%" },
          width: { xs: "94%", sm: "90%", md: "70%" },
          maxWidth: "900px",
          maxHeight: "900px",
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
          views={['month']} // Solo muestra la vista de mes
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

      <Menu
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "8px",
          },
        }}
      >
        <MenuItem onClick={() => handleDaySelection("green")}>Sí</MenuItem>
        <MenuItem onClick={() => handleDaySelection("red")}>No</MenuItem>
        <MenuItem onClick={() => handleDaySelection("orange")}>?</MenuItem>
      </Menu>

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
          onClick={() => setStep((prev) => (prev > 1 ? prev - 1 : 1))}
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
