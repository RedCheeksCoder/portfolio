// Single source of truth for booking rules that live OUTSIDE of GHL's own
// calendar settings. Working hours, slot duration, and buffer are now owned by
// the GHL calendar itself (Settings -> Calendars -> [calendar] -> Availability) —
// GHL's free-slots API already returns slots respecting those settings, so this
// file no longer duplicates that policy. What's left here is just:
export const BOOKING_CONFIG = {
  timezone: process.env.BOOKING_TIMEZONE || 'Asia/Manila',
  // Must match the slot duration configured on the GHL calendar itself — used
  // here only to compute a slot's end time and to validate booking payloads,
  // NOT to generate slots (GHL does that). If you change the duration in GHL,
  // change it here too.
  slotDurationMinutes: 30,
  // Extra client-facing guardrails on top of whatever GHL returns — not a
  // replacement for GHL's own scheduling-window settings, just a second check.
  minNoticeHours: 12,
  maxAdvanceDays: 30,
};
