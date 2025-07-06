// src/services/firebaseDatabase.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const calendarExists = async (calendarId) => {
  const docRef = doc(db, "calendarios", calendarId);
  const docSnap = await getDoc(docRef);
  console.log("🔍 Existe el calendario", calendarId, ":", docSnap.exists());
  return docSnap.exists();
};

export const createCalendar = async (calendarId, password) => {
  const docRef = doc(db, "calendarios", calendarId);
  await setDoc(docRef, {
    password: password,
    users: []
  });
};

export const checkCalendarPassword = async (calendarId, password) => {
  const docRef = doc(db, "calendarios", calendarId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return false;
  const data = docSnap.data();
  return data.password === password;
};

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
