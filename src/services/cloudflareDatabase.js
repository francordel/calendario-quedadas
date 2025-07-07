const isLocal = window?.location?.hostname === "localhost";

const API_BASE = isLocal
  ? "https://calendario-quedadas.pages.dev"
  : "";

// Generate a random calendar ID with a readable format
export const generateCalendarId = () => {
  const adjectives = [
    'amazing', 'bright', 'creative', 'dynamic', 'elegant', 'fantastic', 'gorgeous', 'happy',
    'incredible', 'joyful', 'kind', 'lovely', 'magnificent', 'nice', 'outstanding', 'perfect',
    'quality', 'radiant', 'stunning', 'terrific', 'unique', 'vibrant', 'wonderful', 'excellent'
  ];
  
  const nouns = [
    'calendar', 'meeting', 'event', 'schedule', 'planner', 'organizer', 'agenda', 'timeline',
    'gather', 'connect', 'sync', 'plan', 'book', 'date', 'time', 'slot', 'space', 'room',
    'session', 'appointment', 'conference', 'group', 'team', 'project'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}-${randomNoun}-${randomNumber}`;
};

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


export const createCalendar = async (calendarId) => {
  console.log("📡 Creando calendario:", calendarId);
  try {
    const res = await fetch(`${API_BASE}/api/create-calendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarId }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Respuesta no-JSON:", raw);
      return { success: false, error: "Invalid response format" };
    }

    const data = await res.json();
    console.log("📥 Respuesta de creación:", data);
    return { success: data.ok, calendarId: data.calendarId, error: data.error };
  } catch (err) {
    console.error("❌ Error en createCalendar:", err);
    return { success: false, error: err.message };
  }
};

// Generate a unique calendar ID by checking if it already exists
export const generateUniqueCalendarId = async (maxAttempts = 10) => {
  console.log("🎲 Generando ID único de calendario");
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const calendarId = generateCalendarId();
    console.log(`📝 Intento ${attempt}: ${calendarId}`);
    
    try {
      const exists = await calendarExists(calendarId);
      if (!exists) {
        console.log("✅ ID único encontrado:", calendarId);
        return { success: true, calendarId };
      }
      console.log("⚠️ ID ya existe, generando otro...");
    } catch (err) {
      console.error(`❌ Error verificando ID en intento ${attempt}:`, err);
    }
  }
  
  console.error("❌ No se pudo generar un ID único después de", maxAttempts, "intentos");
  return { success: false, error: "No se pudo generar un ID único" };
};

// Password functionality removed - calendars are now open access

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
