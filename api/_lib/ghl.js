// GHL (GoHighLevel) REST API v2 — plain fetch, no SDK.
// NOTE: verify these exact endpoint paths/scopes against GHL's current API docs
// before going live — their API has moved around between versions. This targets
// the v2 API at services.leadconnectorhq.com with a Private Integration token.
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

// Full dual-write: upsert contact then create the appointment. Returns
// { ok: true, appointment } or { ok: false, error } — never throws, so callers
// (api/book.js) can treat GHL failure as non-fatal per the plan's design.
export async function syncBookingToGhl({ name, email, phone, start, end, notes }) {
  try {
    const contactId = await upsertContact({ name, email, phone });
    const appointment = await createAppointment({
      contactId,
      start,
      end,
      title: `Discovery Call — ${name}${notes ? ` (${notes.slice(0, 80)})` : ''}`,
    });
    return { ok: true, appointment };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
