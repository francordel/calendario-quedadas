import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale"; // Para idioma español
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Button, Typography } from "@mui/material";
import "./Calendar.css"; // CSS personalizado

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Calendar() {
  const { calendarId } = useParams();
  const [selectedDays, setSelectedDays] = useState({ green: [], red: [], orange: [] });
  const [step, setStep] = useState(1);

  const handleSelectSlot = ({ start }) => {
    const selectedDate = new Date(start).toDateString();
    setSelectedDays((prev) => {
      const updated = { ...prev };
      const currentStepKey = step === 1 ? "green" : step === 2 ? "red" : "orange";
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((day) => day !== selectedDate);
      });
      updated[currentStepKey].push(selectedDate);
      return updated;
    });
  };

  const events = [
    ...selectedDays.green.map((day) => ({ start: new Date(day), end: new Date(day), title: "Sí", color: "#A5D6A7" })), // Verde pastel
    ...selectedDays.red.map((day) => ({ start: new Date(day), end: new Date(day), title: "No", color: "#EF9A9A" })), // Rojo pastel
    ...selectedDays.orange.map((day) => ({ start: new Date(day), end: new Date(day), title: "?", color: "#FFE082" })), // Naranja pastel
  ];

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color,
      color: "white",
      borderRadius: "10px", // Bordes redondeados
      border: "none",
      display: "block",
      padding: "5px",
    };
    return { style };
  };

  return (
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100vw", // Ocupar todo el ancho visible
    height: "100vh", // Ocupar toda la altura visible
    padding: 0,
    backgroundColor: "#e7f2f6", // Malva pastel para cubrir todo
  }}
>
  <Typography variant="h4" gutterBottom>
    Calendario: {calendarId}
  </Typography>
  <Typography variant="body1" gutterBottom>
    Paso {step === 1 ? "1: Selecciona los días disponibles (verde)" : step === 2 ? "2: Selecciona los días no disponibles (rojo)" : "3: Selecciona los días de esfuerzo (naranja)"}
  </Typography>
  <Box
    sx={{
      height:{xs: "55%", sm: "70%", md: "70%" },
      width: { xs: "94%", sm: "90%", md: "70%" }, // Ancho dinámico según el tamaño de la pantalla
      maxWidth: "900px",
      maxHeight: "900px",
      borderRadius: "16px", // Bordes redondeados
      overflow: "hidden",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra
    }}
  >
    <BigCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={handleSelectSlot}
      style={{
        height: "100%", // Altura por defecto
        width: "100%", // Ajusta al contenedor padre
        fontSize: "14px", // Tamaño de texto más pequeño para pantallas pequeñas
      }}
      eventPropGetter={eventStyleGetter}
    />
  </Box>
  <Button
    variant="contained"
    color="primary"
    onClick={() => setStep((prev) => (prev < 3 ? prev + 1 : 1))}
    sx={{
      marginTop: 1,
      fontSize: { xs: "12px", sm: "14px", md: "16px" }, // Botón más pequeño en pantallas pequeñas
    }}
  >
    {step < 3 ? "Continuar" : "Reiniciar"}
  </Button>
</Box>

  );
}

export default Calendar;
