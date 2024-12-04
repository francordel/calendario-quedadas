import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Calendar() {
  const { calendarId } = useParams();
  const [step, setStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState({ green: [], red: [], orange: [] });
  const [finalRecommendation, setFinalRecommendation] = useState([]);
  const [popupData, setPopupData] = useState(null);

  const toggleDay = (day, status) => {
    setSelectedDays((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((d) => d !== day);
      });
      if (status) updated[status].push(day);
      return updated;
    });
  };

  const handleFinalize = () => {
    const allUsersData = [
      { name: "Usuario1", green: [1, 2, 3], red: [5, 6], orange: [4] },
      { name: "Usuario2", green: [1, 3, 4], red: [6], orange: [2, 5] },
      { name: "Usuario3", green: [1, 3, 6], red: [2, 5], orange: [4] },
    ];

    const allDays = Array.from({ length: 31 }, (_, i) => i + 1);
    const recommendations = allDays
      .filter((day) => !allUsersData.some((user) => user.red.includes(day))) // Descartar días rojos
      .map((day) => {
        const greenCount = allUsersData.filter((user) => user.green.includes(day)).length;
        const orangeCount = allUsersData.filter((user) => user.orange.includes(day)).length;
        return { day, greenCount, orangeCount, priority: greenCount - orangeCount };
      })
      .sort((a, b) => b.priority - a.priority || a.orangeCount - b.orangeCount);

    setFinalRecommendation(recommendations);
    setStep(4);
  };

  const handleDayClick = (day) => {
    const allUsersData = [
      { name: "Usuario1", green: [1, 2, 3], red: [5, 6], orange: [4] },
      { name: "Usuario2", green: [1, 3, 4], red: [6], orange: [2, 5] },
      { name: "Usuario3", green: [1, 3, 6], red: [2, 5], orange: [4] },
    ];

    const dayData = allUsersData.map((user) => ({
      name: user.name,
      status: user.green.includes(day)
        ? "verde"
        : user.red.includes(day)
        ? "rojo"
        : user.orange.includes(day)
        ? "naranja"
        : "sin preferencia",
    }));
    setPopupData({ day, dayData });
  };

  const closePopup = () => setPopupData(null);

  return (
    <div>
      <h1>Calendario: {calendarId}</h1>
      {step === 1 && (
        <>
          <h2>Selecciona los días que puedes (verde)</h2>
          <CalendarGrid
            selectedDays={selectedDays}
            toggleDay={(day) => toggleDay(day, "green")}
          />
          <button onClick={() => setStep(2)}>Continuar</button>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Selecciona los días que no puedes (rojo)</h2>
          <CalendarGrid
            selectedDays={selectedDays}
            toggleDay={(day) => toggleDay(day, "red")}
          />
          <button onClick={() => setStep(3)}>Continuar</button>
        </>
      )}
      {step === 3 && (
        <>
          <h2>Selecciona los días que puedes hacer un esfuerzo (naranja)</h2>
          <CalendarGrid
            selectedDays={selectedDays}
            toggleDay={(day) => toggleDay(day, "orange")}
          />
          <button onClick={handleFinalize}>Finalizar</button>
        </>
      )}
      {step === 4 && (
        <>
          <h2>Días Recomendados</h2>
          <CalendarGrid
            recommendedDays={finalRecommendation}
            onDayClick={handleDayClick}
            showPriority
          />
        </>
      )}
      {popupData && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalles del Día {popupData.day}</h3>
            <ul>
              {popupData.dayData.map((user, idx) => (
                <li key={idx}>
                  {user.name}: {user.status}
                </li>
              ))}
            </ul>
            <button onClick={closePopup}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarGrid({ selectedDays = {}, recommendedDays = [], toggleDay, onDayClick, showPriority }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
      {days.map((day) => {
        const recommended = recommendedDays.find((rec) => rec.day === day);
        const color = recommended
          ? "blue"
          : selectedDays.green?.includes(day)
          ? "green"
          : selectedDays.red?.includes(day)
          ? "red"
          : selectedDays.orange?.includes(day)
          ? "orange"
          : "white";
        return (
          <div
            key={day}
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid black",
              backgroundColor: color,
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => (recommended ? onDayClick(day) : toggleDay(day))}
          >
            {day}
            {recommended && showPriority && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "white",
                  borderRadius: "50%",
                  padding: "2px 5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {recommended.priority}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Calendar;
