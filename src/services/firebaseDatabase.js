// src/services/firebaseDatabase.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

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
  const docRef = doc(db, "calendarios", calendarId);
  const docSnap = await getDoc(docRef);
  console.log("🔍 Existe el calendario", calendarId, ":", docSnap.exists());
  return docSnap.exists();
};

export const createCalendar = async (calendarId) => {
  try {
    const docRef = doc(db, "calendarios", calendarId);
    await setDoc(docRef, {
      createdAt: new Date().toISOString(),
      users: []
    });
    return { success: true, calendarId };
  } catch (error) {
    console.error("❌ Error creating calendar:", error);
    return { success: false, error: error.message };
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
  const docRef = doc(db, "calendarios", calendarId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];
  const data = docSnap.data();
  console.log("📤 Datos recibidos del calendario:", data);
  return data.users || [];
};

export const saveUserSelections = async (userId, calendarId, selectedDays) => {
  const docRef = doc(db, "calendarios", calendarId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.error('El calendario no existe en Firebase.');
    return false;
  }

  const data = docSnap.data();
  const users = data.users || [];
  const existingUserIndex = users.findIndex(u => u.userId === userId);

  if (existingUserIndex !== -1) {
    users[existingUserIndex].selectedDays = selectedDays;
  } else {
    users.push({ userId, selectedDays });
  }

  console.log("👤 Guardando usuarios actualizados:", users);
  await setDoc(docRef, { users }, { merge: true });
  return true;
};
