// src/services/index.js
import * as mockDB from './mockDatabase';
import * as firebaseDB from './firebaseDatabase';

const useFirebase = process.env.REACT_APP_USE_FIREBASE === 'true';

export const {
  calendarExists,
  createCalendar,
  checkCalendarPassword,
  fetchCalendarSelections,
  saveUserSelections
} = useFirebase ? firebaseDB : mockDB;
