import * as mockDB from './mockDatabase';
import * as firebaseDB from './firebaseDatabase';
import * as cloudflareDB from './cloudflareDatabase';

const mode = process.env.REACT_APP_DB_MODE || 'mock'; // mock | firebase | cloudflare

const selected = {
  mock: mockDB,
  firebase: firebaseDB,
  cloudflare: cloudflareDB
}[mode];

export const {
  calendarExists,
  createCalendar,
  checkCalendarPassword,
  fetchCalendarSelections,
  saveUserSelections
} = selected;

