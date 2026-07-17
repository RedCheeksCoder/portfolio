// Pure logic, no I/O — safe to unit-test directly with `node`.
// Slot generation itself now lives in GHL (its own calendar's working
// hours/duration/buffer settings) — what's left here is just timezone math for
// formatting/validating what GHL returns, and the booking-window guardrail.

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

export function isDateWithinBookingWindow(dateStr, config, now = new Date()) {
  const dayStart = zonedTimeToUtc(dateStr, '00:00', config.timezone);
  const todayStart = zonedTimeToUtc(now.toISOString().slice(0, 10), '00:00', config.timezone);
  const maxDate = new Date(now.getTime() + config.maxAdvanceDays * 86400000);
  return dayStart.getTime() >= todayStart.getTime() && dayStart <= maxDate;
}

// True if `start` (a real Date instant) is far enough in the future per minNoticeHours.
export function meetsMinNotice(start, config, now = new Date()) {
  return start.getTime() >= now.getTime() + config.minNoticeHours * 3600000;
}
