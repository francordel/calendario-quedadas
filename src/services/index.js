import * as mockDB from './mockDatabase';
import * as firebaseDB from './firebaseDatabase';
import * as cloudflareDB from './cloudflareDatabase';

const mode = process.env.REACT_APP_DB_MODE || 'cloudflare'; // mock | firebase | cloudflare
console.log("🧠 MODO DE BASE DE DATOS ACTIVO:", mode);

const selected = {
  mock: mockDB,
  firebase: firebaseDB,
  cloudflare: cloudflareDB
}[mode];
console.log("🧠 Modo de base de datos activo:", mode);
export const {
  calendarExists,
  createCalendar,
  generateUniqueCalendarId,
  fetchCalendarSelections,
  saveUserSelections
} = selected;

// Helper function to get specific user data from calendar
export const getUserFromCalendar = async (calendarId, userName) => {
  try {
    const allUsers = await fetchCalendarSelections(calendarId);
    const user = allUsers.find(u => u.userId === userName);
    return user || null;
  } catch (error) {
    console.error('Error getting user from calendar:', error);
    return null;
  }
};

