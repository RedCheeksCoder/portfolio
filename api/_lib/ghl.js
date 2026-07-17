// GHL (GoHighLevel) REST API v2 — plain fetch, no SDK. GHL is now the ONLY
// external system this backend talks to (Google Calendar was removed 2026-07-18
// — see CLAUDE.md §12 for why). GHL's calendar is the single source of truth
// for both availability and bookings.
//
// NOTE: verify these exact endpoint paths/params/response shapes against GHL's
// live API reference before going live. GHL's docs site renders parameter
// tables and example payloads client-side (JS), which this environment
// couldn't fully extract via automated fetch — confirmed endpoints exist
// (GET /calendars/:calendarId/free-slots, POST /calendars/events/appointments)
// but exact query param names and the free-slots response shape should be
// double-checked against a live request during `vercel dev` testing, ideally
// by inspecting one real response before trusting the parsing below blindly.
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} env var`);
  return v;
}

function ghlHeaders() {
  return {
    Authorization: `Bearer ${requireEnv('GHL_PRIVATE_INTEGRATION_TOKEN')}`,
    Version: GHL_API_VERSION,
    'Content-Type': 'application/json',
  };
}

// Fetches GHL's own computed free slots for a calendar over [startDate, endDate)
// (Date instants). Returns a flat array of real UTC Date `start` instants.
//
// GHL's documented response shape is "an availability map keyed by date
// (YYYY-MM-DD)" — the exact per-date value shape (array of ISO start-time
// strings vs. array of {startTime} objects) wasn't confirmed from docs, so
// this parses defensively across the shapes GHL is known to have used.
export async function getFreeSlots(startDate, endDate, timezone) {
  const calendarId = requireEnv('GHL_CALENDAR_ID');
  const params = new URLSearchParams({
    startDate: String(startDate.getTime()), // epoch ms — GHL v2 commonly uses epoch ms for date-range params; VERIFY
    endDate: String(endDate.getTime()),
    timezone,
  });
  const res = await fetch(`${GHL_BASE}/calendars/${calendarId}/free-slots?${params}`, {
    method: 'GET',
    headers: ghlHeaders(),
  });
  if (!res.ok) {
    throw new Error(`GHL getFreeSlots failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();

  const starts = [];
  for (const dateKey of Object.keys(data)) {
    if (dateKey === 'traceId') continue; // GHL includes a traceId field alongside date keys in some versions
    const dayValue = data[dateKey];
    const rawSlots = Array.isArray(dayValue) ? dayValue : dayValue?.slots;
    if (!Array.isArray(rawSlots)) continue;
    for (const slot of rawSlots) {
      const iso = typeof slot === 'string' ? slot : (slot.startTime || slot.start);
      if (iso) starts.push(new Date(iso));
    }
  }
  return starts;
}

// Creates or updates a contact by email, returns the contact id.
export async function upsertContact({ name, email, phone }) {
  const locationId = requireEnv('GHL_LOCATION_ID');
  const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: ghlHeaders(),
    body: JSON.stringify({ locationId, name, email, phone }),
  });
  if (!res.ok) {
    throw new Error(`GHL upsertContact failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const contactId = data.contact?.id || data.id;
  if (!contactId) throw new Error('GHL upsertContact: no contact id in response');
  return contactId;
}

// Creates an appointment on the configured GHL calendar for the given contact.
export async function createAppointment({ contactId, start, end, title }) {
  const locationId = requireEnv('GHL_LOCATION_ID');
  const calendarId = requireEnv('GHL_CALENDAR_ID');
  const res = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
    method: 'POST',
    headers: ghlHeaders(),
    body: JSON.stringify({
      locationId,
      calendarId,
      contactId,
      title,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    }),
  });
  if (!res.ok) {
    throw new Error(`GHL createAppointment failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
