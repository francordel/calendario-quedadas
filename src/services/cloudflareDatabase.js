const isLocal = window?.location?.hostname === "localhost";

const API_BASE = isLocal
  ? "https://calendario-quedadas.pages.dev"
  : "";

export const calendarExists = async (calendarId) => {
  console.log("📡 Verificando existencia:", calendarId);
  try {
    const res = await fetch(`${API_BASE}/api/fetch?calendarId=${calendarId}`);
    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Respuesta no-JSON del Worker:", raw);
      return false;
    }

    const data = await res.json();
    console.log("📥 Respuesta JSON:", data);
    return data.ok && data.exists;
  } catch (err) {
    console.error("❌ Error en calendarExists:", err);
    return false;
  }
};


export const createCalendar = async (calendarId, password) => {
  console.log("📡 Creando calendario:", calendarId);
  try {
    const res = await fetch(`${API_BASE}/api/create-calendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarId, password }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Respuesta no-JSON:", raw);
      return false;
    }

    const data = await res.json();
    console.log("📥 Respuesta de creación:", data);
    return data.ok;
  } catch (err) {
    console.error("❌ Error en createCalendar:", err);
    return false;
  }
};

export const checkCalendarPassword = async (calendarId, password) => {
  console.log("📡 Verificando contraseña para:", calendarId);
  try {
    const res = await fetch(`${API_BASE}/api/check-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarId, password }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Respuesta no-JSON:", raw);
      return false;
    }

    const data = await res.json();
    console.log("📥 Respuesta de contraseña:", data);
    return data.ok;
  } catch (err) {
    console.error("❌ Error en checkCalendarPassword:", err);
    return false;
  }
};

export const fetchCalendarSelections = async (calendarId) => {
  console.log("📡 Obteniendo selecciones:", calendarId);
  try {
    const res = await fetch(`${API_BASE}/api/fetch?calendarId=${calendarId}`);
    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Respuesta no-JSON:", raw);
      return [];
    }

    const data = await res.json();
    console.log("📥 Usuarios recibidos:", data.users);
    return data.ok && data.exists ? data.users : [];
  } catch (err) {
    console.error("❌ Error en fetchCalendarSelections:", err);
    return [];
  }
};

export const saveUserSelections = async (userId, calendarId, selectedDays) => {
  console.log("📡 Guardando selección:", { userId, calendarId, selectedDays });
  try {
    const res = await fetch(`${API_BASE}/api/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, calendarId, selectedDays }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Respuesta no-JSON:", raw);
      return false;
    }

    const data = await res.json();
    console.log("📥 Resultado del guardado:", data);
    return data.ok;
  } catch (err) {
    console.error("❌ Error en saveUserSelections:", err);
    return false;
  }
};
