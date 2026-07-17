// Pure logic, no I/O — safe to unit-test directly with `node`.

// Offset (in minutes, local - UTC) of `timeZone` at the instant `date`.
// Uses Intl's real tz database so this is correct across DST if it's ever needed,
// even though Asia/Manila itself has none.
export function getTimeZoneOffsetMinutes(date, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUTC - date.getTime()) / 60000;
}

function formatOffsetString(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

// Converts a wall-clock "YYYY-MM-DD" + "HH:mm" in `timeZone` to a real UTC Date instant.
export function zonedTimeToUtc(dateStr, timeStr, timeZone) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const naiveUtc = Date.UTC(y, m - 1, d, hh, mm, 0);
  const offsetMin = getTimeZoneOffsetMinutes(new Date(naiveUtc), timeZone);
  return new Date(naiveUtc - offsetMin * 60000);
}

// Formats a UTC Date instant as an ISO string with `timeZone`'s local offset, e.g. 2026-07-20T09:00:00+08:00
export function toOffsetISOString(date, timeZone) {
  const offsetMinutes = getTimeZoneOffsetMinutes(date, timeZone);
  const local = new Date(date.getTime() + offsetMinutes * 60000);
  const pad = (n) => String(n).padStart(2, '0');
  const y = local.getUTCFullYear(), mo = pad(local.getUTCMonth() + 1), d = pad(local.getUTCDate());
  const h = pad(local.getUTCHours()), mi = pad(local.getUTCMinutes()), s = pad(local.getUTCSeconds());
  return `${y}-${mo}-${d}T${h}:${mi}:${s}${formatOffsetString(offsetMinutes)}`;
}

// Day-of-week (0=Sun..6=Sat) for a "YYYY-MM-DD" date string, evaluated in `timeZone`.
export function weekdayInZone(dateStr, timeZone) {
  const noonUtc = zonedTimeToUtc(dateStr, '12:00', timeZone);
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' });
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[dtf.format(noonUtc)];
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Generates candidate slots for a given date, minus any that overlap busy blocks
 * (expanded by config.bufferMinutes on each side) or fall inside the minimum-notice window.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {object} config - BOOKING_CONFIG
 * @param {{start: Date, end: Date}[]} busyBlocks - busy periods as real UTC Date instants
 * @param {Date} now - current instant (injectable for testing)
 * @returns {{start: Date, end: Date}[]}
 */
export function generateSlots(dateStr, config, busyBlocks, now = new Date()) {
  const weekday = weekdayInZone(dateStr, config.timezone);
  if (!config.workingDays.includes(weekday)) return [];

  const dayStart = zonedTimeToUtc(dateStr, config.workingHours.start, config.timezone);
  const dayEnd = zonedTimeToUtc(dateStr, config.workingHours.end, config.timezone);
  const slotMs = config.slotDurationMinutes * 60000;
  const bufferMs = config.bufferMinutes * 60000;
  const minNoticeMs = config.minNoticeHours * 3600000;
  const earliestAllowed = new Date(now.getTime() + minNoticeMs);

  const slots = [];
  for (let start = dayStart; start.getTime() + slotMs <= dayEnd.getTime(); start = new Date(start.getTime() + slotMs)) {
    const end = new Date(start.getTime() + slotMs);
    if (start < earliestAllowed) continue;
    const blocked = busyBlocks.some((b) =>
      overlaps(start, end, new Date(b.start.getTime() - bufferMs), new Date(b.end.getTime() + bufferMs))
    );
    if (blocked) continue;
    slots.push({ start, end });
  }
  return slots;
}

export function isDateWithinBookingWindow(dateStr, config, now = new Date()) {
  const dayStart = zonedTimeToUtc(dateStr, '00:00', config.timezone);
  const maxDate = new Date(now.getTime() + config.maxAdvanceDays * 86400000);
  return dayStart.getTime() >= zonedTimeToUtc(
    new Date(now).toISOString().slice(0, 10), '00:00', config.timezone
  ).getTime() && dayStart <= maxDate;
}
