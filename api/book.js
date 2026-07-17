import { BOOKING_CONFIG } from './_lib/config.js';
import { getBusyBlocks, createCalendarEvent } from './_lib/googleCalendar.js';
import { syncBookingToGhl } from './_lib/ghl.js';

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
    const busyBlocks = await getBusyBlocks(startDate, endDate);
    const stillFree = !busyBlocks.some((b) => startDate < b.end && b.start < endDate);
    if (!stillFree) {
      res.status(409).json({
        success: false,
        error: 'slot_taken',
        message: 'That time was just booked. Please pick another slot.',
      });
      return;
    }

    const event = await createCalendarEvent({
      start: startDate,
      end: endDate,
      summary: `Discovery Call — ${name}`,
      description: [phone ? `Phone: ${phone}` : null, notes ? `Notes: ${notes}` : null]
        .filter(Boolean)
        .join('\n'),
    });

    // GHL failure is treated as non-fatal — the Google Calendar hold is real either
    // way, so the visitor still sees success. Logged for manual follow-up.
    const ghlResult = await syncBookingToGhl({ name, email, phone, start: startDate, end: endDate, notes });
    if (!ghlResult.ok) {
      console.error('GHL sync failed for booking', event.id, ghlResult.error);
    }

    res.status(200).json({
      success: true,
      eventId: event.id,
      start,
      end,
      ghlSynced: ghlResult.ok,
    });
  } catch (err) {
    console.error('booking error:', err);
    res.status(500).json({ success: false, error: 'server_error', message: 'Could not complete the booking. Please try again.' });
  }
}
