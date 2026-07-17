import { BOOKING_CONFIG } from './_lib/config.js';
import { isDateWithinBookingWindow, meetsMinNotice, toOffsetISOString, zonedTimeToUtc } from './_lib/slots.js';
import { getFreeSlots } from './_lib/ghl.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const { date } = req.query;
  if (!date || !DATE_RE.test(date)) {
    res.status(400).json({ error: 'invalid_date', message: 'date must be YYYY-MM-DD' });
    return;
  }

  if (!isDateWithinBookingWindow(date, BOOKING_CONFIG)) {
    res.status(200).json({ date, timezone: BOOKING_CONFIG.timezone, slots: [] });
    return;
  }

  try {
    const dayStart = zonedTimeToUtc(date, '00:00', BOOKING_CONFIG.timezone);
    const dayEnd = zonedTimeToUtc(date, '23:59', BOOKING_CONFIG.timezone);
    const starts = await getFreeSlots(dayStart, dayEnd, BOOKING_CONFIG.timezone);

    const now = new Date();
    const slotMs = BOOKING_CONFIG.slotDurationMinutes * 60000;
    const slots = starts
      .filter((start) => meetsMinNotice(start, BOOKING_CONFIG, now))
      .map((start) => ({ start, end: new Date(start.getTime() + slotMs) }))
      .sort((a, b) => a.start - b.start);

    res.status(200).json({
      date,
      timezone: BOOKING_CONFIG.timezone,
      slots: slots.map((s) => ({
        start: toOffsetISOString(s.start, BOOKING_CONFIG.timezone),
        end: toOffsetISOString(s.end, BOOKING_CONFIG.timezone),
      })),
    });
  } catch (err) {
    console.error('availability error:', err);
    res.status(500).json({ error: 'server_error', message: 'Could not load availability right now.' });
  }
}
