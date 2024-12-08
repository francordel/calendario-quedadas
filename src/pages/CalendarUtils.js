    // Genera todos los días en los próximos años
    export const getAllDaysInNextYears = () => {
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        const end = new Date(start.getFullYear() + 4, start.getMonth() + 1, 0);
        const days = [];
        let current = new Date(start);
    
        while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
        }
    
        return days;
    };
  
    // Genera los eventos a partir de los días seleccionados
    export const generateEvents = (days, handleEventClick) => {
        console.log("Generando eventos...");
        const newEvents = [];
        Object.entries(days).forEach(([key, dates]) => {
          dates.forEach((date) => {
            newEvents.push({
              start: new Date(date),
              end: new Date(date),
              title: key === "green" ? "Sí" : key === "red" ? "No" : "?",
              color: key === "green" ? "#A5D6A7" : key === "red" ? "#EF9A9A" : "#FFE082",
              // No asignamos onClick directamente aquí
            });
          });
        });
        return newEvents;
      };
      
  
    
  
  // Establece los estilos y las acciones de los eventos
export const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color,
      color:"white",
      borderRadius: "10px",
      border: "none",
      display: "block",
      padding: "5px",
      pointerEvents: "none", 
    };
  
    return { style };
  };
  
  
  // Obtiene la configuración para los días pasados
  export const dayPropGetter = (date) => {
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
  