// Genera los eventos a partir de los días seleccionados
export const generateEvents = (days, handleEventClick) => {
    console.log("Generando eventos...");
    const newEvents = [];
    Object.entries(days).forEach(([key, dates]) => {
          dates.forEach((date) => {
            newEvents.push({
              start: new Date(date),
              end: new Date(date),
              title: key === "green" ? "✓ Disponible" : key === "red" ? "✗ No disponible" : "? Quizás",
              type: key,
              className: `event-${key}`,
              // Enhanced event data for premium UX
              resource: {
                type: key,
                icon: key === "green" ? "✓" : key === "red" ? "✗" : "?",
                description: key === "green" ? "Disponible para reunirse" : 
                           key === "red" ? "No disponible" : "Disponible con esfuerzo"
              }
            });
          });
        });
        return newEvents;
      };
      
  
    
  
  // Establece los estilos y las acciones de los eventos
export const eventStyleGetter = (event) => {
    const baseStyle = {
      border: "none",
      borderRadius: "12px",
      color: "white",
      fontWeight: "600",
      fontSize: "12px",
      textAlign: "center",
      padding: "6px 12px",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
      pointerEvents: "auto",
    };

    // Premium gradient backgrounds based on event type
    let background;
    switch (event.type) {
      case "green":
        background = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
        break;
      case "red":
        background = "linear-gradient(135deg, #fa709a 0%, #fee140 100%)";
        break;
      case "orange":
        background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
        break;
      default:
        background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }

    return { 
      style: { ...baseStyle, background },
      className: `rbc-event ${event.className || ''}`
    };
  };
  
  
  // Obtiene la configuración para los días pasados
  export const dayPropGetter = (date) => {
    const today = new Date();
    const isPast = date < today.setHours(0, 0, 0, 0);
    const isToday = date.toDateString() === today.toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
    let className = '';
    let style = {
      position: 'relative',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (isPast) {
      className += 'past-day ';
      style = {
        ...style,
        background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
        color: '#94a3b8',
        pointerEvents: 'none',
      };
    } else if (isToday) {
      className += 'today ';
      style = {
        ...style,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        border: '2px solid #667eea',
        fontWeight: '600',
      };
    } else if (isWeekend) {
      className += 'weekend ';
      style = {
        ...style,
        background: 'linear-gradient(145deg, rgba(252, 165, 165, 0.05), rgba(254, 202, 202, 0.05))',
      };
    }
  
    return {
      style,
      className: className.trim(),
    };
  };
  