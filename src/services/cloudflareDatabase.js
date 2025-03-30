export const calendarExists = async (calendarId) => {
    try {
      const res = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId })
      });
      const users = await res.json();
      return Array.isArray(users);
    } catch (error) {
      console.error("Error comprobando existencia del calendario:", error);
      return false;
    }
  };
  
  export const createCalendar = async (calendarId, password) => {
    try {
      const res = await fetch('/api/create-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId, password })
      });
      const data = await res.json();
      return data.ok;
    } catch (error) {
      console.error("Error creando calendario:", error);
      return false;
    }
  };
  
  export const checkCalendarPassword = async (calendarId, password) => {
    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId, password })
      });
      const data = await res.json();
      return data.ok;
    } catch (error) {
      console.error("Error comprobando contraseña:", error);
      return false;
    }
  };
  
  export const fetchCalendarSelections = async (calendarId) => {
    try {
      const res = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId })
      });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener selecciones:", error);
      return [];
    }
  };
  
  export const saveUserSelections = async (userId, calendarId, selectedDays) => {
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, calendarId, selectedDays })
      });
      const data = await res.json();
      return data.ok;
    } catch (error) {
      console.error("Error al guardar selecciones:", error);
      return false;
    }
  };
  