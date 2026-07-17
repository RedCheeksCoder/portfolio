import { google } from 'googleapis';

let cachedClient = null;

function getAuthClient() {
  if (cachedClient) return cachedClient;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY env vars');
  }
  // Vercel env vars store the key as a single line with literal \n sequences.
  const privateKey = rawKey.replace(/\\n/g, '\n');
  cachedClient = new google.auth.JWT(email, undefined, privateKey, ['https://www.googleapis.com/auth/calendar']);
  return cachedClient;
}

function getCalendarId() {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error('Missing GOOGLE_CALENDAR_ID env var');
  return id;
}

// Returns busy blocks (as real Date instants) for the given UTC window.
export async function getBusyBlocks(windowStart, windowEnd) {
  const auth = getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = getCalendarId();
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: windowStart.toISOString(),
      timeMax: windowEnd.toISOString(),
      items: [{ id: calendarId }],
    },
  });
  const busy = res.data.calendars?.[calendarId]?.busy || [];
  return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

// Creates a calendar event. sendUpdates is intentionally 'none' — a bare service
// account (no domain-wide delegation) cannot send native Calendar invite emails on
// Bryan's behalf. GHL's reminder automation is the actual visitor-facing notification
// channel (see CLAUDE.md "Booking Backend" for the full rationale).
export async function createCalendarEvent({ start, end, summary, description }) {
  const auth = getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = getCalendarId();
  const res = await calendar.events.insert({
    calendarId,
    sendUpdates: 'none',
    requestBody: {
      summary,
      description,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    },
  });
  return res.data;
}
