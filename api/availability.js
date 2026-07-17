import { BOOKING_CONFIG } from './_lib/config.js';
import { generateSlots, isDateWithinBookingWindow, toOffsetISOString, zonedTimeToUtc } from './_lib/slots.js';
import { getBusyBlocks } from './_lib/googleCalendar.js';

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
    // Fetch busy blocks for the full day window so generateSlots can filter locally.
    const dayStart = zonedTimeToUtc(date, '00:00', BOOKING_CONFIG.timezone);
    const dayEnd = zonedTimeToUtc(date, '23:59', BOOKING_CONFIG.timezone);
    const busyBlocks = await getBusyBlocks(dayStart, dayEnd);

    const slots = generateSlots(date, BOOKING_CONFIG, busyBlocks);
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
