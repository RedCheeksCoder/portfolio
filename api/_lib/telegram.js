// Telegram Bot API — plain fetch, no SDK (matches the zero-dependency style
// of api/_lib/ghl.js). Used only by api/contact.js to push a formatted
// notification to Bryan's own Telegram chat whenever the portfolio contact
// form is submitted. Telegram is the only external system this module talks
// to — no GHL contact is created for these inquiries (see CLAUDE.md §14).
const TELEGRAM_BASE = 'https://api.telegram.org';

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} env var`);
  return v;
}

// Escapes the handful of characters Telegram's HTML parse mode treats as
// markup. Required, not optional: sendMessage is called with
// parse_mode:'HTML' below, so an unescaped '<' in a visitor's question would
// make Telegram reject the whole message with a 400 parse error.
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Sends a single HTML-formatted message to the configured chat.
export async function sendTelegramMessage(text) {
  const token = requireEnv('TELEGRAM_BOT_TOKEN');
  const chatId = requireEnv('TELEGRAM_CHAT_ID');
  const res = await fetch(`${TELEGRAM_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram sendMessage failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
