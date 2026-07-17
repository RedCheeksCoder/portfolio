import { BOOKING_CONFIG } from './_lib/config.js';
import { zonedTimeToUtc } from './_lib/slots.js';
import { getFreeSlots, upsertContact, createAppointment } from './_lib/ghl.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body) {
  const { start, end, name, email } = body || {};
  if (!start || !end || !name || !email) return 'missing_fields';
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) return 'invalid_time_range';
  if (!EMAIL_RE.test(email)) return 'invalid_email';
  const durationMinutes = (endDate - startDate) / 60000;
  if (durationMinutes !== BOOKING_CONFIG.slotDurationMinutes) return 'invalid_duration';
  if (startDate < new Date()) return 'in_the_past';
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const validationError = validatePayload(req.body);
  if (validationError) {
    res.status(400).json({ success: false, error: validationError });
    return;
  }

  const { start, end, name, email, phone, notes } = req.body;
  const startDate = new Date(start);
  const endDate = new Date(end);

  try {
    // Re-check availability immediately before writing — narrows (does not fully
    // eliminate) the race window between two people booking the same slot. See
    // CLAUDE.md "Booking Backend" for the accepted-limitation rationale.
    const dayStart = zonedTimeToUtc(start.slice(0, 10), '00:00', BOOKING_CONFIG.timezone);
    const dayEnd = zonedTimeToUtc(start.slice(0, 10), '23:59', BOOKING_CONFIG.timezone);
    const freeStarts = await getFreeSlots(dayStart, dayEnd, BOOKING_CONFIG.timezone);
    const stillFree = freeStarts.some((s) => Math.abs(s.getTime() - startDate.getTime()) < 60000);
    if (!stillFree) {
      res.status(409).json({
        success: false,
        error: 'slot_taken',
        message: 'That time was just booked. Please pick another slot.',
      });
      return;
    }

    const contactId = await upsertContact({ name, email, phone });
    const appointment = await createAppointment({
      contactId,
      start: startDate,
      end: endDate,
      title: `Discovery Call — ${name}${notes ? ` (${notes.slice(0, 80)})` : ''}`,
    });

    res.status(200).json({
      success: true,
      appointmentId: appointment.id || appointment.appointment?.id,
      start,
      end,
    });
  } catch (err) {
    console.error('booking error:', err);
    res.status(500).json({ success: false, error: 'server_error', message: 'Could not complete the booking. Please try again.' });
  }
}
