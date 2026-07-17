// Single source of truth for booking rules. These are defaults — confirm with
// Bryan and adjust before going live (see CLAUDE.md "Booking Backend" section).
export const BOOKING_CONFIG = {
  timezone: process.env.BOOKING_TIMEZONE || 'Asia/Manila',
  workingDays: [1, 2, 3, 4, 5], // Mon-Fri, 0=Sun
  workingHours: { start: '09:00', end: '17:00' },
  slotDurationMinutes: 30,
  bufferMinutes: 10,
  minNoticeHours: 12,
  maxAdvanceDays: 30,
};
