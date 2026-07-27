import { BOOKING_CONFIG } from './_lib/config.js';
import { sendTelegramMessage, escapeHtml } from './_lib/telegram.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LEN = {
  name: 100,
  whatsapp: 40,
  email: 200,
  question: 2000,
};

function validatePayload(body) {
  const { name, email, question } = body || {};
  if (!name || !name.trim() || !email || !email.trim() || !question || !question.trim()) {
    return 'missing_fields';
  }
  if (!EMAIL_RE.test(email)) return 'invalid_email';
  for (const [field, max] of Object.entries(MAX_LEN)) {
    const value = body[field];
    if (value && String(value).length > max) return 'too_long';
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const { name, whatsapp, email, question, company } = req.body || {};

  // Honeypot: real visitors never see or fill this field (it's off-screen and
  // out of tab order in index.html). A bot that fills every input trips it.
  // Silently accept so the bot gets no signal it was caught — nothing is sent.
  if (company) {
    res.status(200).json({ success: true });
    return;
  }

  const validationError = validatePayload(req.body);
  if (validationError) {
    res.status(400).json({ success: false, error: validationError });
    return;
  }

  try {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: BOOKING_CONFIG.timezone,
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const text = [
      '📬 <b>New portfolio inquiry</b>',
      '',
      `<b>Name:</b> ${escapeHtml(name.trim())}`,
      `<b>WhatsApp:</b> ${whatsapp && whatsapp.trim() ? escapeHtml(whatsapp.trim()) : '—'}`,
      `<b>Email:</b> ${escapeHtml(email.trim())}`,
      '',
      '<b>Question:</b>',
      escapeHtml(question.trim()),
      '',
      `Sent ${escapeHtml(timestamp)} (${escapeHtml(BOOKING_CONFIG.timezone)})`,
    ].join('\n');

    await sendTelegramMessage(text);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('contact form error:', err);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Could not send your message. Please try again, or email me directly.',
    });
  }
}
