#!/usr/bin/env node
/**
 * Generates bryan-odina.vcf — the digital business card offered at /connect.
 *
 * Run from the repo root:  node scripts/build-vcard.js
 *
 * vCard 3.0, not 4.0: 3.0 is what iOS Contacts, Android and Google Contacts
 * all import reliably. Zero dependencies, consistent with the rest of the repo
 * (the photo is base64'd straight from the JPEG's bytes — no image decoding).
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'bryan-odina.vcf');

const PHONE = '+639276476889';                // also the WhatsApp number
const WA = 'https://wa.me/639276476889';      // must match index.html's footer
const PHOTO_URL = 'https://assets.cdn.filesafe.space/7qfXIFSTdrRVqc8n8dWk/media/6a5948aae5e255d974b8e541.jpg';

const SOCIALS = {
  linkedin: 'https://www.linkedin.com/in/johnbryanodina',
  facebook: 'https://www.facebook.com/bryanodinalevelupacademy',
  tiktok:   'https://www.tiktok.com/@bryan.odina.ghlca',
  youtube:  'https://www.youtube.com/@LevelUpAcademyPH',
};

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

/**
 * RFC 6350 line folding: no line may exceed 75 octets. Continuations begin
 * with a single space, which the parser strips. The PHOTO blob is ~170KB on
 * one logical line — left unfolded, some parsers reject the whole card.
 * Folding is done on OCTETS, not characters, so multi-byte UTF-8 (the "·"
 * in TITLE) can never be split mid-sequence.
 */
function fold(line) {
  const buf = Buffer.from(line, 'utf8');
  if (buf.length <= 75) return line;
  const out = [];
  let i = 0, limit = 75;
  while (i < buf.length) {
    let end = Math.min(i + limit, buf.length);
    // don't split a UTF-8 multi-byte sequence: back off to a lead byte
    while (end > i && end < buf.length && (buf[end] & 0xC0) === 0x80) end--;
    out.push(buf.slice(i, end).toString('utf8'));
    i = end;
    limit = 74; // continuation lines carry a leading space, so 74 + 1 = 75
  }
  return out[0] + out.slice(1).map(s => '\r\n ' + s).join('');
}

(async () => {
  process.stdout.write('fetching photo… ');
  const photo = await get(PHOTO_URL);
  if (photo[0] !== 0xFF || photo[1] !== 0xD8) throw new Error('photo is not a JPEG');
  console.log(photo.length + ' bytes');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Odina;Bryan;;;',
    'FN:Bryan Odina',
    'ORG:Level Up Academy',
    'TITLE:Automation Consultant · GHL Certified Admin',
    `TEL;TYPE=CELL,VOICE:${PHONE}`,
    `EMAIL;TYPE=INTERNET:bryanodina.ghl@gmail.com`,
    'URL:https://bryanodina.com',
    `X-SOCIALPROFILE;TYPE=whatsapp:${WA}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${SOCIALS.linkedin}`,
    `X-SOCIALPROFILE;TYPE=facebook:${SOCIALS.facebook}`,
    `X-SOCIALPROFILE;TYPE=tiktok:${SOCIALS.tiktok}`,
    `X-SOCIALPROFILE;TYPE=youtube:${SOCIALS.youtube}`,
    `NOTE:I build CRM\\, funnel and AI automation systems — so businesses grow without adding to payroll. WhatsApp: ${PHONE}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString('base64')}`,
    'END:VCARD',
  ];

  // vCard requires CRLF line endings.
  const vcf = lines.map(fold).join('\r\n') + '\r\n';
  fs.writeFileSync(OUT, vcf, 'utf8');
  console.log('wrote ' + OUT + ' (' + fs.statSync(OUT).size + ' bytes)');
})().catch(err => { console.error(err.message); process.exit(1); });
