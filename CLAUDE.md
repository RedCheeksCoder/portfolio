# CLAUDE.md — Bryan Odina Portfolio

This file gives any Claude (Code, chat, or otherwise) working in this repo the full context of what this project is, what's already been decided, and what's still pending. Read this before making any changes.

**Also read `LOGS.md`** in this same folder — it's the running changelog. Every session that modifies this codebase must append an entry to it (see "Logging Rules" at the bottom of this file).

---

## 1. Project Overview

A single-page HTML portfolio site for **Bryan Odina** — GHL-Certified Admin, Licensed Electronics Engineer, and automation consultant based in the Philippines. The frontend is still one file: `index.html` (HTML + CSS + JS inline, no build step, no framework). (The file previously lived at the repo root as `portoflio.html` — it was moved into this folder and renamed to match this doc on 2026-07-18.)

**As of 2026-07-18, this is no longer a purely static site.** A Vercel serverless API backend (`api/`, `package.json`) was added to power the custom booking widget — see §12 "Booking Backend" for the full architecture. The frontend itself remains build-step-free; only the new `api/` functions have a dependency (`googleapis`).

**Positioning / core message:** "Stop hiring for work that automation can already do." The entire site exists to convince visitors (both business owners and agencies) that Bryan builds automation systems that let them grow without adding headcount.

**Target audience:** General automation clients — both individual business owners looking to cut overhead and agencies/CTOs needing automation infrastructure.

**Desired brand feel:** Professional, trustful, dependable. Not flashy or gimmicky — credibility-first.

**Bryan's roles referenced in the copy:**
- CTO at The 414 Project (digital agency) — **corrected 2026-07-18, was previously "Power & Presence"**
- GHL expert at Wisdom Church of Manila
- Runs Level Up Academy (free community for Filipino VAs/freelancers — GHL, n8n, AI tools)
- 5+ years as an engineering professor before going into automation

---

## 2. Approved Copy (do not rewrite without explicit request)

**Hero eyebrow** (small label above the headline): "What I Can Do For Your Business" — **changed 2026-07-18, was "Automation Systems"**.

**Hero headline:**
> Stop Hiring for Work That Automation Can Already Do

**Hero subheadline** (em dashes removed 2026-07-18 per Bryan's request — was two `—` around the middle clause, now commas):
> I architect and build automation systems, from CRM workflows to AI-powered processes, that handle the repetitive, time-consuming work, so you can grow without adding to payroll.

**Process steps (3-step discovery call framing):**
1. Review Processes
2. Find Gaps
3. List Down Next Steps

These were chosen deliberately after presenting multiple headline/subheadline options — treat as final unless Bryan asks to revisit again (as he did with the eyebrow/subheadline on 2026-07-18).

---

## 3. Design System

### Fonts
- **Primary (display/headings):** Sansation
- **Secondary (body):** Quicksand
- Loaded via Google Fonts `<link>` in `<head>`.

### Colors — sourced from wolfpackbasecamp.com/skool-offer
| Token | Hex | Usage |
|---|---|---|
| Primary orange | `#A54F16` | Buttons, filled/primary elements |
| Secondary orange | `#CC7E31` | Text accents, links, stars, highlights (better contrast as text on dark bg than primary) |
| Background | `#151513` | Main page background |
| Secondary background / footer | `#0B0B0B` | Alternating sections, footer |
| White text | `#F4F1E8` | Primary text color |

CSS variables are defined in `:root` at the top of the `<style>` block — always edit tokens there, not hardcoded hex values scattered in rules.

### Signature visual element
A small animated SVG node-flow diagram in the hero (Trigger → Automate → Notify, with a dot traveling the path) — represents automation visually instead of a generic photo/icon. Respects `prefers-reduced-motion`.

### Marquee banner (below hero)
- Full-width, **straight/no tilt** (explicitly requested — do not re-add rotation).
- Background: linear-gradient 90°, `#A54F16` → `#CC7E31`, both at 50% opacity (so the dark page background shows through).
- White uppercase Sansation text, 50 AI/automation keywords (n8n, Make, GoHighLevel, Zapier, API, LLM, RAG, MCP, etc.), duplicated list for seamless infinite loop.
- Scroll direction: **left to right**, **slow** (120s per loop — was 60s, halved per feedback). Pauses on hover. No animation if `prefers-reduced-motion`.

---

## 4. Site Structure (current section order)

1. **Header/Nav** — sticky, blurred backdrop, links to all sections + "Book a call" CTA
2. **Hero** — headline, subheadline, CTA buttons, credential tags, node-flow diagram, profile photo, stat counters
3. **Marquee banner** — 50-keyword scrolling strip (see §3)
4. **About** — photo + bio, ties back to automation-first positioning
5. **Certifications** — badge grid (GHL + 4 n8n badges), see §6
6. **Services** — 9-card grid (Website Design & Dev, Workflow Automation, AI Integration, Payment Integration, Email/SMS Marketing, Customer Pipeline, Course Creation, Community Build, Third-Party Integration)
7. ~~Gallery ("Inside the Systems")~~ — **removed entirely 2026-07-18** per Bryan's request. It was a horizontal-scroll screenshot showcase that briefly existed between Services and Work; now fully deleted (section HTML, nav link, and all now-unused `.gallery-*`/`.privacy-note`/`.work-thumb-wrap` CSS were cleaned up too, not just hidden). Its content is superseded by the case-study modals in Work (§11) anyway.
8. **Work** — filterable grid of case studies (filters: All / Web & Funnels / Automation / AI / Web Apps / Payments / Courses & Community / **A2P/10DLC Compliance**). Each card shows a thumbnail (swaps per selected category — see §11), short description, tag pills, external link where applicable, and a **"Learn more →"** trigger (renamed from "View case study →" on 2026-07-18) that opens the full case-study modal (see §11). All 16 cards have thumbnails. Directly follows Services now (background alternation adjusted: `#work` changed from `section alt` to plain `section` to compensate for Gallery's removal).
9. **Process Design ("SOP Flowcharts")** — `#flowcharts`, added 2026-07-18, restructured same day. Grid of **10** cards (down from 13 individual images — Space Coast Leads' 4 diagrams were consolidated into one card). 9 of the 10 use invented business names for industries with no real named client behind them (Bryan does not have a named client behind these industries — see §5); the 10th, Space Coast Leads, is real. **No "Sample Build" disclosure is shown anywhere** — the agent added one initially but Bryan asked for it removed on 2026-07-18 (see §11). Clicking any card opens the same case-study modal used by Work. Sits between Work and Teaching, alternating background (`section alt`). Linked from nav as "Process Maps".
10. **Teaching & Content** — 4 short vertical videos (GHL, n8n, credit repair, self-discipline explainers)
11. **Testimonials** — 6 client quotes with avatar photos, 5-star ratings
12. **Process** — 3-step discovery call framing (see §2)
13. **Book a Discovery Call** — custom-built booking widget backed by Vercel serverless functions (see §7 and §12), replacing the old embedded GHL iframe
14. **Contact** — copy + static contact form (no backend wired up — see §8 Known Gaps)
15. **Footer** — brand, credentials line, social links

A global **lightbox** (`#lightbox`) handles click-to-expand single-image preview — used indirectly (dynamically wired via JS) by images inside the case-study modal. Nothing in the static page markup uses `data-full` anymore (that was the Gallery's mechanism); Work-card and flowchart thumbnails open the case-study modal instead (see §11).

---

## 5. Case Studies / Work Section — Content Inventory

**Filter categories:** `web`, `automation`, `ai`, `apps`, `payments`, `courses`, `compliance` (space-separated in `data-category`, cards can belong to multiple). `compliance` added 2026-07-18 (see §6/§11).

| Project | Industry | Categories | `data-case` slug | Notes |
|---|---|---|---|---|
| Vanguard Credits | Credit Repair | ai, apps, automation | `vanguard` | Default thumbnail (card + first modal image) is now a clean website capture, unblurred. **The other 8 images in its modal are real dispute-letter PII and stay CSS-blurred — see §9.** |
| Woop | Creator Platform | apps, courses | `woop` | |
| NextLevel | Productivity SaaS | apps | `nextlevel` | |
| Squirrel Insurance | Insurance | web, automation, **compliance** | `squirrel` | Visit-site URL corrected to `squirrelinsurance.com/home`. **AutoQuote does NOT belong to Squirrel** — corrected 2026-07-18, moved to Meritex (see below). |
| The Bill Busters | Service Company | web, automation, **compliance** | `tbb` | Social-automation image assignment is still an assumption (see §8). |
| Genesis Credit | Credit Repair | ai, automation, web, **compliance** | `gcr` | Largest modal — 18 images (website + 3 AI agent + 13 automation + A2P). |
| AEMR | Medical Education | web, automation, payments, courses | `aemr` | Default thumbnail is now a real website capture (was the course-structure image, which moved to a `courses`-filter thumbnail override instead). |
| DeAnna Crawford | Coaching | **web, automation** (no longer `payments`/`courses`) | `deanna` | Per Bryan 2026-07-18: dropped payments/courses — modal now includes a social planner screenshot + 3 automation screenshots; copy rewritten around funnel + lead scoring + automation + social calendar. |
| Level Up Academy | Gamified Course | courses, automation | `lua` | Bryan's own platform, 8.7K-member community |
| Funded Biz | Business Funding | ai, web | `fundedbiz` | |
| Federal Barbers | Barbershop | web | `federalbarbers` | |
| Wisdom Church of Manila | Non-Profit | **payments, automation** (no longer `web`) | `wisdomchurch` | Per Bryan 2026-07-18: this client is payments + automation only. |
| Charity Lift | Charity | web | `charitylift` | GHL AI Studio build |
| Meritex Canada | Corporate | **web, apps, automation** | `meritex` | **AutoQuote (5 images) moved here from Squirrel on 2026-07-18** — Meritex is the actual owner. Now has an `apps`-filter thumbnail override showing AutoQuote, and copy updated to mention it. |
| Celeste Nicolas Ministries | Ministry | **payments, automation** (no longer `web`/`courses`) | `celestenicolas` | Per Bryan 2026-07-18: shares the *same* automation build as Wisdom Church of Manila — its modal reuses Wisdom Church's 5 automation images. |
| Space Coast Leads | Lead Generation | **automation** (no longer `web`, per Bryan 2026-07-18) | `spacecoastleads` | Modal shows its 4 SOP flowchart images (same 4 used in the Process Design section — see §11). |

**Vanguard Credits, Woop, and NextLevel were added in an earlier session** as new case studies not previously on Bryan's live site.

---

## 6. Certifications / Badges Section

Displays 5 badge cards, each linking out to a verification URL:

| Badge | Image (CDN) | Verify link |
|---|---|---|
| GHL Certified Admin | `.../media/6a595a391097b811959c1dc8.png` | (image itself, no separate verify page) |
| n8n Quick Start | `.../media/6a59688d1097b81195a133b7.png` | `badges.n8n.io/4b4bd738-7bff-4d97-b395-b5b92d115d5b` |
| N8N101 | `.../media/6a59688da3791820f854ebd9.png` | `badges.n8n.io/997640e6-dab6-437f-ba73-6c45340555c5#acc.soNl8Oig` |
| N8N102 | `.../media/6a59688da3791820f854ebd4.png` | `badges.n8n.io/b1e5bae8-b195-46b6-a3d8-49a50b766d6b` |
| N8N103 | `.../media/6a59688d9c9b37b5fd59b1bf.png` | `badges.n8n.io/5b55f813-088b-47fa-b2b0-5d6278ab5fbe#acc.ZibeY4Bt` |

All CDN images are hosted at `https://assets.cdn.filesafe.space/7qfXIFSTdrRVqc8n8dWk/media/...` (Bryan's own GHL media storage — safe to hotlink directly, no download/rehost needed).

**A2P/10DLC Compliance — moved out of this section on 2026-07-18.** It briefly lived here as a second badge row, but Bryan asked for it to move into the **Work section** instead, as a new filter category (`compliance`) rather than a certifications badge. See §5 and §11. The 3 approval screenshots (The Bill Busters, Squirrel Insurance, Genesis Credit) now live inside those clients' case-study modals and as their `compliance`-filtered thumbnail. **Note carried over:** the mapping of which CDN link belongs to which client was inferred from file-modification order in Bryan's local folder (`Portfolio/A2P approved/`), not an explicit label — still worth Bryan's visual confirmation.

**Credential tag group** (appears in hero + footer) must always include all four: Licensed Electronics Engineer, GHL Certified Admin, Six Sigma Yellow Belt, **N8N Certified**.

---

## 7. Booking / Calendar

**Rebuilt entirely on 2026-07-18** — see §12 "Booking Backend" for the full architecture. Summary: the old GHL iframe embed (`links.levelupacademy.cc/widget/booking/y7JL04RcQUy2EyhUm1FQ`) is gone, replaced by a custom-styled widget (`#bookingWidget`) built entirely from the site's own CSS/JS, backed by new Vercel serverless functions (`/api/availability`, `/api/book`) that check Bryan's real Google Calendar and write bookings to both Google Calendar and GHL.

**Why this replaced the iframe:** cross-origin iframes are sandboxed by the browser (Same-Origin Policy) — page CSS genuinely cannot reach inside to restyle GHL's colors. GHL's own dashboard only exposes Primary/Background color pickers, and only for their "Neo" calendar style, with no custom-CSS hook (confirmed against GHL's own support docs, not guessed). That GHL-dashboard color fix is **still worth doing** as a low-effort backup/reference (Calendar → Calendar Settings → [calendar] → ⋮ → Edit → Customizations tab → confirm Neo style → set Primary `#CC7E31` / Background `#151513`), but Bryan opted for full replacement instead of living with that partial fix.

All "Book a call" CTAs across the page (`nav`, hero, about, contact) still link to `#book`, the anchor for this section — unchanged.

**This feature is not fully live yet** — the code is built and unit/regression-tested, but requires Bryan to complete the credential setup and deployment steps in §12 before it can actually check his calendar or write bookings anywhere. Until then, `/api/availability` and `/api/book` will throw (missing env vars) if actually deployed without credentials configured.

---

## 8. Known Gaps / Pending Work

1. **Screenshot assets — resolved 2026-07-18.** All `images/...` placeholder paths (gallery + work-card thumbnails) have been replaced with Bryan's actual GHL CDN links, sourced from the `.txt` link files he dropped in the `Portfolio/` folder (one per content category — `Website captures.txt`, `Web applications.txt`, `Automations.txt`, etc.). No local `images/` folder is used — everything hotlinks to `assets.cdn.filesafe.space`, consistent with the badges/hero/about photos that already worked this way. Compression isn't needed since nothing is self-hosted.
   - Still open: the `.txt` source files remain in `Portfolio/` (not deleted) — fine to leave as reference, or Bryan may want them cleaned up once he's confirmed everything mapped correctly.

2. **Contact form has no backend.** It's static HTML — submit does nothing yet. Needs a form action / GHL form embed / serverless endpoint, depending on what Bryan wants.

3. **Hero photo vs. About photo** — currently two different images are used (hero uses the original profile pic, About section was updated to a new photo per Bryan's request). Confirm with Bryan if he wants them unified.

4. **A2P badge mapping needs visual confirmation** — see §6 note; client labels were inferred, not explicitly sourced.

5. **Image-to-client assumptions:**
   - ~~AutoQuote assumed to belong to Squirrel Insurance~~ — **corrected 2026-07-18: Bryan confirmed AutoQuote belongs to Meritex Canada**, not Squirrel. Moved accordingly (see §5).
   - Of the 3 unlabeled "Social Media Automation" screenshots, only 1 was assumed to belong to **The Bill Busters**, based on a local filename (`Portfolio/Social Media Automation/The bill Buster Social Media automation.png`) matching in spirit — the other 2 links in that txt file are still unused since no client could be inferred. **Still needs Bryan's confirmation.**

6. **All Work-section Description/Problem/Work-Done copy, and all 9 invented Process Design case studies, are agent-drafted and unreviewed.** Bryan asked for a draft-then-review pass (see §11) — none of this copy should be treated as final until he's read through it.

7. **Booking backend built but not live** — see §12. Blocked entirely on Bryan completing the Google Cloud service-account setup, the GHL Private Integration setup, and Vercel deployment/env vars. Until then the booking widget is deployed as static HTML with no working backend behind it if pushed as-is.

8. **Booking config values unconfirmed** — working hours (default Mon–Fri 9–5), timezone (default Asia/Manila), meeting duration (default 30min), buffer (default 10min), minimum notice (default 12h), max advance window (default 30 days), and the exact fields collected (currently mirrors the old contact form: name/email/phone/notes) are all agent defaults in `api/_lib/config.js` — confirm/adjust with Bryan, especially duration (should match whatever the old GHL widget was actually configured for, to avoid a silent behavior regression).

---

## 9. CRITICAL — Sensitive Data Handling

Some screenshots in Bryan's Drive contain **real third-party personal information** and must never be published as-is:

- **Vanguard Credits** screenshots (credit dispute letters) show a real consumer's full name, date of birth, home address, and partial SSN.
- **Woop** screenshot #3 shows Bryan's own home address and phone number.
- **NextLevel** screenshot #5 shows other users' email addresses.

**Rule: these specific images must be blurred (whole image, not just the sensitive region) with a text overlay explaining "some sensitive information has been blurred for privacy."** This was an explicit instruction from Bryan — do not publish these unblurred, do not skip the overlay text, and do not assume newly-added screenshots are safe without checking for similar PII first.

**Current implementation (updated 2026-07-18 three times — case-study modal shipped, real Vanguard Credits website capture added, then the Gallery section that used to hold a blurred preview was removed entirely):** No image-editing tool is available in this environment, so blurring is done at render time instead of on the source file:
- The Gallery section (and its `.gallery-blur`/`.privacy-note` blurred preview of Vanguard Credits) no longer exists on the page at all — removed per Bryan's request (see §4). This actually reduces PII exposure surface, not just moves it.
- **The Vanguard Credits work-card thumbnail is now a real website-capture screenshot (`6a5a7d07baf5f6da40225faf.png`), unblurred** — Bryan confirmed this is fine since it's just the marketing site, no PII. It's also the first image in the `vanguard` case-study modal (`blur:false`).
- **The other 8 Vanguard Credits images in the modal are the dispute-letter screenshots and stay `blur:true`** in `CASE_STUDIES` — Bryan explicitly confirmed (2026-07-18) that only the new website-capture thumbnail should go unblurred, and the real-PII dispute letters keep the blur + "Blurred for privacy" overlay treatment, both in the modal grid and in the full-size lightbox (caption appends `(blurred for privacy)`). **Do not remove blur from any Vanguard Credits image showing an actual dispute letter/consumer data without Bryan explicitly re-confirming** — this was checked directly with him once already given how consequential getting it wrong would be.
- The underlying `<img src>` in all cases is still the unblurred CDN link — the blur is CSS-only, applied on the live page, not baked into a rehosted file. This satisfies "whole image blurred + overlay" but is worth knowing: anyone who opens the image URL directly (view-source, right-click → open image) sees the original unblurred screenshot. If Bryan wants a harder guarantee, the CDN images themselves need to be replaced with pre-blurred versions.
- Woop screenshot #3 and NextLevel screenshot #5 **are** now included in their clients' case-study modals (per "everything found" scope), each individually flagged `blur:true` in `CASE_STUDIES` and rendered with the same blur+overlay treatment. The work-card default thumbnail for both still uses a different, PII-free image (Woop 1, NextLevel 1).
- Any future work that adds more Vanguard Credits / Woop / NextLevel screenshots must check against this list before wiring them into `CASE_STUDIES`, and set `blur:true` on the `im()` call if needed.

---

## 10. Interaction Details (for reference when editing)

- **Scroll reveal:** `.reveal` class + IntersectionObserver, fades/slides up on scroll into view. Falls back to instantly visible if `IntersectionObserver` unsupported. Disabled under `prefers-reduced-motion`.
- **Work filter:** `.filter-btn[data-filter]` buttons toggle `.hidden` on `.work-card[data-category]` by matching space-separated category tokens, and also trigger the per-category thumbnail swap (see §11).
- **Lightbox:** case-modal images wire into `#lightbox` dynamically via `openLb()` (no static page markup uses `data-full` anymore since Gallery was removed). Closes on ✕ button, backdrop click, or Escape key.
- **Booking widget:** see §12. Escape key also closes the case modal now (`closeCase()` added to the same `keydown` listener as the lightbox).
- All frontend JS is vanilla, inline at the bottom of `index.html` — **zero external JS dependencies** as of 2026-07-18 (the GHL embed script was deleted along with the iframe it supported). The new `api/` backend has one dependency (`googleapis`), but that's server-side only, never shipped to the browser.

---

## 11. Case-Study Modal System (added 2026-07-18)

Replaced the old "click a work-card thumbnail → simple single-image lightbox" behavior with a full case-study modal (`#caseModal`), used by **both** the Work section and the Process Design section.

**Data source — `CASE_STUDIES` JS object** (top of the inline `<script>`, right after the Lightbox setup): keyed by slug (e.g. `vanguard`, `gcr`, `pd-barbershop`). Each entry has:
- `name`, `industry`, `sample` (bool — true only for the 9 invented Process Design cases)
- `description`, `problem`, `workdone` — the three copy fields shown in the modal. **All of this copy was drafted by the agent, not provided by Bryan** — he asked for a draft-then-review pass, so treat every description/problem/workdone string as unreviewed until he confirms it.
- `images: [{src, blur}]` — every image found for that client across *all* the `.txt` source files (per Bryan's explicit "everything found for that client" instruction), not just the one used as the card's default thumbnail. `im(hash, blur)` is a small helper that builds `{src, blur}` from a CDN hash.

**Triggering:** `.work-card` elements carry `data-case="slug"`; a click anywhere on `.work-thumb` or the `.work-case-btn` (labeled **"Learn more →"** — changed from "View case study →" on 2026-07-18) button opens that card's modal (event-delegated on `#workGrid`). `.flow-card[data-case]` elements in Process Design open the same modal directly. (The `.work-thumb-wrap` blur-overlay wrapper pattern — used briefly for the Vanguard Credits card thumbnail — was removed once a safe website-capture thumbnail replaced it; the pattern still exists inside the modal itself as `.case-thumb-wrap.blurred` if a future work-card thumbnail ever needs it again.)

**Rendering (`openCase(slug)`):** populates name/industry/description/problem/workdone, and builds `#caseImages` as a grid of thumbnails from the `images` array. Each thumbnail is independently clickable and opens the shared `#lightbox` (`openLb()`) for a full-size view — so the case modal and the simple lightbox stack (case modal z-index 98, lightbox 100). (No `sample`-tag rendering happens here anymore — see the paragraph below.)

**Category thumbnail-switching:** each `.work-card > .work-thumb` can carry an optional `data-thumbs='{"category":"url",...}'` JSON attribute with category-specific alternate images. The filter-click handler swaps `img.src` to the matching entry when a non-"all" filter is active, and restores the original (`data-default-src`, captured on first swap) otherwise. **Only applied where a genuinely distinct, correctly-identifiable image exists per category** — Squirrel (apps/compliance), TBB (compliance), GCR (ai/automation/compliance), Wisdom Church (automation), Celeste Nicolas (automation), AEMR (automation/payments), Level Up Academy (automation). Cards without a meaningful category-specific image keep their default thumbnail across all filters — this was a deliberate scope limit, not an oversight (fabricating fake per-category specificity for images the agent couldn't actually distinguish was judged worse than a few cards not swapping).

**Process Design invented names, no disclosure:** per Bryan's explicit instruction, all 9 generic industry flowcharts (Barbershop, HVAC, Landscaping, Coaching, Credit Repair, Psych Clinic, PR & Marketing, Podcast Outreach, Contact Flow) were given invented business names (e.g. "Southside Cuts Barbershop") since no real client exists behind them. The agent initially added a "Sample Build" disclosure tag/label as a safeguard against the page reading as if these were verified real clients — **Bryan asked for that disclosure to be removed entirely on 2026-07-18**, and it has been (the `.case-sample-tag` element, its CSS, and the `<em>(Sample Build)</em>` card-grid suffixes are all gone; the `sample:true/false` field still exists in `CASE_STUDIES` as inert metadata but nothing reads it anymore). Space Coast Leads (`pd-spacecoastleads`) is real and was never tagged.

---

## 12. Booking Backend (added 2026-07-18)

Replaces the GHL iframe (see §7) with a custom widget + Vercel serverless API. **Not live yet** — code is complete and tested, but needs Bryan to do the credential setup below before deploying.

### File structure
```
Portfolio/
  package.json, vercel.json, .env.example, .gitignore   # new, project root
  api/
    availability.js       # GET /api/availability?date=YYYY-MM-DD
    book.js                # POST /api/book
    _lib/
      config.js              # BOOKING_CONFIG — working hours/timezone/duration/buffer, single source of truth
      slots.js                # pure slot-generation + timezone math, no I/O — unit-tested directly with `node`
      googleCalendar.js        # service-account auth, freebusy query, event insert
      ghl.js                    # GHL Private Integration REST calls (contact upsert, appointment create)
```
`_lib/` is underscore-prefixed so Vercel's zero-config routing doesn't expose those helpers as routes — only `api/availability.js` and `api/book.js` are callable endpoints.

### Config (`api/_lib/config.js`) — defaults, confirm with Bryan before going live
```js
{
  timezone: 'Asia/Manila',
  workingDays: [1,2,3,4,5],       // Mon-Fri
  workingHours: { start:'09:00', end:'17:00' },
  slotDurationMinutes: 30,
  bufferMinutes: 10,
  minNoticeHours: 12,
  maxAdvanceDays: 30,
}
```
A client-side mirror of `workingDays`/`maxAdvanceDays` exists in `index.html`'s booking JS (`CLIENT_CONFIG`, for greying out unavailable calendar days before the user picks one) — it's UI-only, the server is the real source of truth, but **if Bryan changes `config.js`, update the `CLIENT_CONFIG` mirror in `index.html` to match** or the calendar will show days as clickable that the API then rejects.

### API behavior
- `GET /api/availability?date=YYYY-MM-DD` → queries Google Calendar's Freebusy API for that day, generates candidate slots from `workingHours`/`slotDurationMinutes`, drops any overlapping a busy block (expanded by `bufferMinutes`) or inside `minNoticeHours` of now. Returns `{date, timezone, slots:[{start,end}]}` with slots as ISO strings carrying the correct `+08:00`-style offset (computed via `Intl.DateTimeFormat`, no date library dependency).
- `POST /api/book` (body: `start,end,name,email,phone,notes`) → **re-checks availability for just that slot immediately before writing** (race-condition guard — narrows but doesn't fully eliminate the window two simultaneous bookers could both pass; accepted as tolerable for solo-consultant booking volume, same class of limitation GHL's own widget has). Creates the Google Calendar event (`sendUpdates:'none'` — a bare service account can't send native Calendar invite emails without Workspace domain-wide delegation; GHL's reminder-email automation is the actual visitor-facing notification channel). Then upserts a GHL contact and creates a GHL appointment so Bryan's existing reminder automations fire. **If the GHL half fails after the Google Calendar write already succeeded, the visitor still sees success** (`ghlSynced:false` in the response) since the calendar hold is real either way — the failure is only logged server-side (Vercel function logs) for Bryan to catch manually. This was a deliberate design choice (documented in the original plan), not an oversight.

### Frontend widget
`#bookingWidget` in the `#book` section — three steps (date/slot picker → contact form → confirmation) toggled via `.is-hidden`, reusing the site's existing `.field`/`.btn-primary` styles verbatim and a new `.day-cell`/`.slot-btn` pill pattern styled off the existing `.filter-btn` look. JS lives in the trailing `<script>` block, IIFE-wrapped, after the work-filter code. Slot times display in the visitor's local timezone via the browser's own `toLocaleString`/`toLocaleTimeString` (no library) — the API always computes in `BOOKING_CONFIG.timezone` internally and returns offset-carrying ISO strings.

### Testing done so far (2026-07-18, before any real credentials existed)
- `api/_lib/slots.js`'s pure functions unit-tested directly with `node` (no deps) — weekday detection, full-day slot count, offset-string formatting, busy-block + buffer exclusion, min-notice exclusion, and booking-window bounds all verified correct.
- All new `api/*.js` files syntax-checked (`node --check`).
- Frontend widget flow (calendar render → date select → slot select → form → submit → confirmation, and the 409 `slot_taken` conflict path routing back to the date step with an error) verified end-to-end with Playwright against a **local HTTP server serving `index.html`** with `/api/availability` and `/api/book` mocked (fetch from a `file://` origin doesn't reliably hit route interception, hence the local server). Existing site regressions (work filters, case-study modals) re-verified working alongside the new widget.
- **Not yet tested:** anything against real Google Calendar or real GHL APIs — impossible without the credentials in the next section, which only Bryan can create.

### Credential setup — Bryan must do this himself (agent has no access to his accounts)

**Google Cloud service account:**
1. console.cloud.google.com → create/reuse a project → enable **Google Calendar API**.
2. Create a **Service Account** (no special IAM role needed).
3. Service Account → Keys → Add Key → JSON. Download it — treat like a password, never commit it, never paste it into `index.html`.
4. Note `client_email` and `private_key` from that JSON file.
5. In Google Calendar (as Bryan) → Settings → his calendar → **Share with specific people** → add the service account's `client_email` with **"Make changes to events"** (write access).
6. Note the Calendar ID (Settings → Integrate calendar).

**GHL Private Integration:**
1. In the GHL sub-account currently running the booking widget → Settings → **Private Integrations** (not the legacy API Key page).
2. Create one, scopes: contacts read/write + calendar/appointments write.
3. Copy the token immediately (GHL shows it once).
4. Note the Location ID, and the target Calendar ID (confirm the actual ID from that calendar's own settings page — don't assume it equals the `y7JL04RcQUy2EyhUm1FQ` URL slug from the old iframe).

**Vercel deployment:**
1. Simplest: git init this folder, push to a new GitHub repo, connect via Vercel's "Import Git Repository" flow (auto-deploy on push for future edits).
2. No-git alternative: `npm i -g vercel`, run `vercel` from inside `Portfolio/`.
3. Add all six vars from `.env.example` under Vercel Project Settings → Environment Variables once the project exists — real secrets live only there, never in the repo.

### Known limitations (documented, not silent gaps)
1. **Soft race-guard, not a hard lock** — see API behavior above. Acceptable for expected volume; revisit if booking traffic ever gets high enough for double-bookings to become a real problem.
2. **No native Google Calendar invite email** to the visitor (bare service account can't send them) — GHL's reminder automation is the sole visitor-facing notification. Confirm this matches what the old GHL iframe already did (likely yes, since GHL's own widget was presumably already the notification source).
3. **GHL sync failure is non-fatal** to the visitor-facing response — see API behavior above. Bryan should periodically check Vercel function logs early on until this proves reliable.
4. Config values (working hours, timezone, duration, buffer, notice window, advance window, fields collected) are the agent's defaults, not yet confirmed by Bryan — see §8.

---

## Logging Rules

This project maintains a `LOGS.md` file in the same directory as this `CLAUDE.md`.

**Every time you (the agent) make a change to this codebase, append an entry to `LOGS.md`** — don't wait to be asked. Format:

```
## YYYY-MM-DD — Short summary of the change
- What changed and why
- Files touched
- Anything the user still needs to provide or decide
```

Never delete or rewrite past entries in `LOGS.md` — it's a running history, append-only. If `LOGS.md` doesn't exist yet, create it using this same format, seeded with a "Project initialized" entry summarizing the state described in this `CLAUDE.md`.

Keep `CLAUDE.md` itself in sync too: if a change alters something documented above (a new section, a changed color, a new pending item), update the relevant section of this file in the same session — this file should always reflect the current state of the project, not its history (that's what `LOGS.md` is for).
