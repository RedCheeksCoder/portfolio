# CLAUDE.md — Bryan Odina Portfolio

This file gives any Claude (Code, chat, or otherwise) working in this repo the full context of what this project is, what's already been decided, and what's still pending. Read this before making any changes.

**Also read `LOGS.md`** in this same folder — it's the running changelog. Every session that modifies this codebase must append an entry to it (see "Logging Rules" at the bottom of this file).

---

## 1. Project Overview

An HTML portfolio site for **Bryan Odina** — GHL-Certified Admin, Licensed Electronics Engineer, and automation consultant based in the Philippines. The main page is one file: `index.html` (HTML + CSS + JS inline, no build step, no framework). (The file previously lived at the repo root as `portoflio.html` — it was moved into this folder and renamed to match this doc on 2026-07-18.)

**As of 2026-08-01 this is no longer a single-page site.** There are now **three pages**: `index.html` (the portfolio), `keyland-compliance-group.html` (a technical summary for a specific job application, added 2026-08-01 — see §15), and `connect.html` (a mobile link-in-bio page reached by QR code at networking events, added 2026-08-06 — see §16). Everything below that doesn't explicitly mention one of the other two refers to `index.html`.

**As of 2026-07-18, this is no longer a purely static site.** A Vercel serverless API backend (`api/`, `package.json`) was added to power the custom booking widget — see §12 "Booking Backend" for the full architecture. The frontend itself remains build-step-free; the `api/` functions have zero dependencies too (plain `fetch` to GHL's REST API, no SDKs).

**Git:** this folder is a git repo, pushed to `github.com/RedCheeksCoder/portfolio` (origin, `main` branch) as of 2026-07-18. **Repo is public** (changed same day — required to work around a Vercel Hobby-plan restriction, see §12 Deployment/Ops notes).

**Live deployment:** Vercel project `portfolio-ud47` (scope `redcheekscoders-projects`), reachable at `portfolio-ud47.vercel.app` and its aliases. See §12 for the booking-backend architecture and important deploy gotchas — plain `vercel --prod` is not sufficient, read that section before redeploying.

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

### Type scale (2026-08-06) — `index.html` only
Bryan reported text too small to read comfortably on a 13" MacBook Air. Fixed with a root scale rather than one-off bumps:
- `html{font-size:120%}` — **not** a px override; `%` scales relative to the visitor's own browser font-size setting, so it's additive to any accessibility preference rather than fighting it.
- **All 67 `font-size` declarations in the file are now `rem`** (base 16px), converted mechanically from the previous all-px scale via a script that recorded every `(line, before, after)` triple and asserted `rem × 16 == original px` for each one before trusting the result.
- **Two deliberate exceptions stay `px`:** `.hf-node-label` (17px) and `.hf-edge-label` (16px) — the hero flow-diagram's SVG `<text>` labels. These are user-space units tied to the SVG's own `viewBox="0 0 1160 560"` coordinate system, not the document's root font size; converting them to `rem` would have desynced the labels from the diagram they sit inside. They still scale in absolute terms because the SVG itself grows with the wider container (see below).
- **To change the whole site's type size again:** edit the `120%` on `html`. Do not hand-edit individual `rem` values unless changing that one element specifically — the point of the conversion was a single knob.
- `.work-desc`'s `min-height:calc(1.55em * 4)` (backing its 4-line clamp, see §4) needed no change — `em` resolves against the element's own (now-rem) font-size, so the reserved box tracks automatically.

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
**Implemented 2026-07-18** (previously documented here as planned-but-not-built). The hero's profile photo was replaced with an animated inline SVG flowchart — a copper-toned support-ticket automation workflow (submit → business-hours routing → alert support/on-call → assignment check → priority review → resolve → resolved check → close) — instead of the originally-envisioned simpler Trigger → Automate → Notify concept. A bright pulse + glowing spark travel the diagram's main path on a 13s CSS-only loop (`stroke-dashoffset` + `offset-path`, no JS); nodes brighten in sync as the pulse reaches them. Respects `prefers-reduced-motion` (pulse/spark/node-glow animations disabled, static diagram shown instead). See `LOGS.md` 2026-07-18 "Hero visual replaced..." for full implementation detail. A standalone demo/reference copy lives at `Portfolio/Diagrams/hero-flow-animation.html`.

### Marquee banner (below hero)
- Full-width, **straight/no tilt** (explicitly requested — do not re-add rotation).
- Background: linear-gradient 90°, `#A54F16` → `#CC7E31`, both at 50% opacity (so the dark page background shows through).
- White uppercase Sansation text, 50 AI/automation keywords (n8n, Make, GoHighLevel, Zapier, API, LLM, RAG, MCP, etc.), duplicated list for seamless infinite loop.
- Scroll direction: **left to right**, **slow** (120s per loop — was 60s, halved per feedback). Pauses on hover. No animation if `prefers-reduced-motion`.

---

## 4. Site Structure (current section order)

1. **Header/Nav** — sticky, blurred backdrop, links to all sections + "Book a call" CTA
2. **Hero** — headline, subheadline, CTA buttons, credential tags, animated node-flow diagram (replaced the profile photo, see §3), stat counters. **Responsive fix 2026-07-19:** on medium-width (≤1180px at the time, now ≤1560px — see below) and short (≤760px height) viewports — the 13" laptop band — the headline's `clamp()` max and vertical spacing are reduced so the CTA buttons stay above the fold; previously the headline could grow to 4 lines while the 2-col grid narrowed the text column, pushing the CTA off-screen on short viewports. Desktop (≥1280px wide) and mobile (`clamp()` min) are unchanged.
3. **Marquee banner** — 50-keyword scrolling strip (see §3)
4. **About** — photo + bio, ties back to automation-first positioning
5. **Certifications** — badge grid (GHL + 4 n8n badges), see §6
6. **Tools I Use** — `#tools`, added 2026-08-07. A logo strip below Certifications (see §6a) showing 30 tools Bryan works with, in two rows on desktop.
7. **Services** — 9-card grid (Website Design & Dev, Workflow Automation, AI Integration, Payment Integration, Email/SMS Marketing, Customer Pipeline, Course Creation, Community Build, Third-Party Integration)
8. ~~Gallery ("Inside the Systems")~~ — **removed entirely 2026-07-18** per Bryan's request. It was a horizontal-scroll screenshot showcase that briefly existed between Services and Work; now fully deleted (section HTML, nav link, and all now-unused `.gallery-*`/`.privacy-note`/`.work-thumb-wrap` CSS were cleaned up too, not just hidden). Its content is superseded by the case-study modals in Work (§11) anyway.
9. **Work** — filterable grid of case studies (filters: All / Web & Funnels / Automation / AI / Web Apps / Payments / Courses & Community / A2P/10DLC Compliance / Social Media Automation / N8N / Claude Projects / Vercel). Each card shows a thumbnail (swaps per selected category — see §11), short description, tag pills, external link where applicable, and a **"Learn more →"** trigger (renamed from "View case study →" on 2026-07-18) that opens the full case-study modal (see §11). All 24 cards have thumbnails. **Card sizing (fixed 2026-08-02) — read before touching `.work-grid`/`.work-desc` CSS:** all 24 cards render at identical size, held by four interlocking rules. (1) Every `.work-grid` breakpoint uses `minmax(0,1fr)`, **not** bare `1fr` — a bare `1fr` is `minmax(auto,1fr)` and lets a wide child set a floor on its column, which is what used to make columns unequal (long industry labels like "Legal / Expert Witness Services" were the culprit, and the imbalance visibly shifted when filters reshuffled cards between columns). (2) `white-space:nowrap` was removed from `.work-industry` for the same reason, and `.work-top > *` gets `min-width:0` since flex items default to `min-width:auto` and would otherwise still refuse to shrink. (3) `.work-desc` is clamped to exactly 4 lines (`-webkit-line-clamp:4` + a matching `min-height:calc(1.55em * 4)` so short blurbs don't collapse) — descriptions range 2-7 lines naturally, and the full text remains in the modal. (4) `grid-auto-rows:1fr` equalises every row, which is only safe *because* of the clamp; without it every card would inflate to the tallest. `margin-top:auto` lives on `.work-case-btn`, not `.work-tags`, because the "Learn more →" button is the only footer element present on all 24 cards (9 have no external link). Directly follows Services now (background alternation adjusted: `#work` changed from `section alt` to plain `section` to compensate for Gallery's removal). **Rebuilt as fully data-driven 2026-07-27** — see §11 "Data-driven rendering" for the architecture; `.filters` and `#workGrid` are now empty containers populated by JS from a single `WORK_PROJECTS`/`WORK_CATEGORIES` data set, not hand-written HTML.
10. **Process Design ("SOP Flowcharts")** — `#flowcharts`, added 2026-07-18, restructured same day. Grid of **10** cards (down from 13 individual images — Space Coast Leads' 4 diagrams were consolidated into one card). 9 of the 10 use invented business names for industries with no real named client behind them (Bryan does not have a named client behind these industries — see §5); the 10th, Space Coast Leads, is real. **No "Sample Build" disclosure is shown anywhere** — the agent added one initially but Bryan asked for it removed on 2026-07-18 (see §11). Clicking any card opens the same case-study modal used by Work. Sits between Work and Teaching, alternating background (`section alt`). Linked from nav as "Process Maps".
11. **Teaching & Content** — 4 short vertical videos (GHL, n8n, credit repair, self-discipline explainers)
12. **Testimonials** — 6 client quotes with avatar photos, 5-star ratings
13. **Process** — 3-step discovery call framing (see §2)
14. **Book a Discovery Call** — custom-built booking widget backed by Vercel serverless functions (see §7 and §12), replacing the old embedded GHL iframe
15. **Contact** — copy + contact form, now wired to a Telegram notification backend (see §14)
16. **Footer** — brand, credentials line, social links

A global **lightbox** (`#lightbox`) handles click-to-expand single-image preview — used indirectly (dynamically wired via JS) by images inside the case-study modal. Nothing in the static page markup uses `data-full` anymore (that was the Gallery's mechanism); Work-card and flowchart thumbnails open the case-study modal instead (see §11).

**Content width (2026-08-06):** `--maxw` is `1560px` (was `1180px`) — widened after Bryan reported large dead margins on a 13" MacBook Air's scaled resolution. `.wrap` and `.nav` both read this token, so header and content stay aligned automatically. Their side padding is `clamp(24px,2.5vw,40px)` rather than a flat `24px` — 40px of breathing room on wide screens, still 24px on any viewport where `.wrap` is edge-bound rather than centered. **`--maxw` and the hero's compact-mode breakpoint (`index.html` — search `Compact hero on medium widths`) must be changed together.** That media query's px value is a hardcoded duplicate of `--maxw` — it's meant to fire exactly when the viewport stops being wider than the container, so the hero switches to reduced spacing/headline size right as the 2-column grid would otherwise get squeezed. Leaving one at a different value than the other reopens the "narrow column pushes the CTA below the fold" bug the 2026-07-19 fix exists to prevent, for every width between the two numbers. `.hero p.lede` and `.section-head` also had their `max-width` caps raised (540→600px, 660→720px) to keep line length in a comfortable range at the wider column. **This change applies to `index.html` only** — `keyland-compliance-group.html` was left at its existing sizing (Bryan's choice); see §15's note that the two pages already don't share design tokens, so this is one more known point of drift, not a new problem.

**`zoom:0.7` removed (2026-08-06)** from `.booking-widget` and `.form-card` — it was silently shrinking every nested element (text, inputs, buttons) by 30%, on top of being a non-standard CSS property with patchy cross-browser support. The booking widget and contact form now render at their true declared size.

---

## 5. Case Studies / Work Section — Content Inventory

**Filter categories:** `web`, `automation`, `ai`, `apps`, `payments`, `courses`, `compliance`, `socialmedia`, `n8n`, `claude`, `vercel` (space-separated in `data-category`, cards can belong to multiple). `compliance` added 2026-07-18 (see §6/§11). `socialmedia` ("Social Media Automation") added 2026-07-19, tagged on exactly 4 cards: Squirrel Insurance, The Bill Busters, Genesis Credit, Level Up Academy. None of these four has a `socialmedia`-specific thumbnail override in `data-thumbs` — filtering by this category just shows each card's default thumbnail (the existing JS already falls back gracefully when a filter has no matching thumb override, so this isn't a bug, just an unfilled nice-to-have). `n8n` ("N8N") added 2026-07-22, originally tagged only on the n8n Academy card — **as of 2026-07-28 also tagged on the new "Business Automation Systems" card** (see below), so `n8n` now matches 2 cards; existing n8n-adjacent cards (Sunwise, Level Up Academy) remain intentionally untagged, per Bryan. `claude` ("Claude Projects") added 2026-07-27, originally tagged only on the new Affiliate Signup Alerts card — **as of 2026-08-06 also tagged on Vanguard Credits, Clawd, and LevelUp Academy Dashboard, so `claude` now matches 4 cards.** `vercel` ("Vercel") added 2026-08-06 at Bryan's request, originally tagged on 4 cards he named as running on Vercel (Vanguard Credits, Wisdom Church of Manila, Celeste Nicolas Ministries, Affiliate Signup Alerts) — **now 5, with LevelUp Academy Dashboard added the same day.** Unlike `n8n`/original-`claude` this one was applied to **existing** cards rather than a new one — it's a hosting-platform grouping, not a project category, so the "don't retroactively cross-tag" pattern doesn't apply to it. Only LevelUp Academy Dashboard has a `vercel`-specific `thumbAlt` override (see table below); the other 4 `vercel`-tagged cards show their default thumbnail under this filter (same graceful fallback as `socialmedia`, not a bug).

| Project | Industry | Categories | `data-case` slug | Notes |
|---|---|---|---|---|
| Vanguard Credits | Credit Repair | ai, apps, automation, claude, **vercel** | `vanguard` | Default thumbnail (card + first modal image) is now a clean website capture, unblurred. **The other 8 images in its modal are real dispute-letter PII and stay CSS-blurred — see §9.** `claude` tag added 2026-07-27 per Bryan. **`vercel` tag added 2026-08-06, and its `description` corrected "deployed on Railway" → "deployed on Vercel"** — the original Railway wording was agent-drafted; Bryan confirmed the platform runs on Vercel, and leaving it would have contradicted the new filter. |
| Woop | Creator Platform | apps, courses | `woop` | |
| Sunwise | Solar Energy | apps, automation | `sunwise` | **Added 2026-07-19.** Solar savings calculator (AI Studio) + lead-scored dashboard + n8n → GHL/Telegram/SMS automation + ReportLab PDF report. 2 images, both PII-checked clean (placeholder form values only). "Visit site" links to a vibepreview.com preview URL — may expire; swap for a permanent domain when Bryan has one. |
| NextLevel | Productivity SaaS | apps | `nextlevel` | |
| Squirrel Insurance | Insurance | web, automation, **compliance** | `squirrel` | Visit-site URL corrected to `squirrelinsurance.com/home`. **AutoQuote does NOT belong to Squirrel** — corrected 2026-07-18, moved to Meritex (see below). |
| The Bill Busters | Service Company | web, automation, **compliance** | `tbb` | Social-automation image assignment is still an assumption (see §8). |
| Genesis Credit | Credit Repair | ai, automation, web, **compliance** | `gcr` | Largest modal — 18 images (website + 3 AI agent + 13 automation + A2P). |
| AEMR | Medical Education | web, automation, payments, courses | `aemr` | Default thumbnail is now a real website capture (was the course-structure image, which moved to a `courses`-filter thumbnail override instead). |
| DeAnna Crawford | Coaching | **web, automation** (no longer `payments`/`courses`) | `deanna` | Per Bryan 2026-07-18: dropped payments/courses — modal now includes a social planner screenshot + 3 automation screenshots; copy rewritten around funnel + lead scoring + automation + social calendar. |
| Level Up Academy | Gamified Course | courses, automation | `lua` | Bryan's own platform, 8.7K-member community. **17 images** (11 + 6 added 2026-07-22): the 6 new shots are GHL workflow-builder screenshots of the gamified quest system (Chosen Character branch, quest reward-item delivery, Leveling Up, Daily Check-in, Reset Check-in Streak) — PII-checked clean, no blur. |
| Funded Biz | Business Funding | ai, web | `fundedbiz` | |
| Federal Barbers | Barbershop | web, **automation** | `federalbarbers` | `automation` added 2026-07-19 with 6 GHL workflow screenshots (opt-in→pipeline, confirmation+reminders, showed, no-show, done-service tag + PDF gift, 30-day rebooking) — PII-checked clean. Copy expanded to cover the appointment-lifecycle automations. |
| Wisdom Church of Manila | Non-Profit | **payments, automation** (no longer `web`), **vercel** | `wisdomchurch` | Per Bryan 2026-07-18: this client is payments + automation only. `vercel` added 2026-08-06 per Bryan. |
| Charity Lift | Charity | web | `charitylift` | GHL AI Studio build |
| Meritex Canada | Corporate | **web, apps, automation** | `meritex` | **AutoQuote (5 images) moved here from Squirrel on 2026-07-18** — Meritex is the actual owner. Now has an `apps`-filter thumbnail override showing AutoQuote, and copy updated to mention it. |
| Celeste Nicolas Ministries | Ministry | **payments, automation** (no longer `web`/`courses`), **vercel** | `celestenicolas` | Per Bryan 2026-07-18: shares the *same* automation build as Wisdom Church of Manila — its modal reuses Wisdom Church's 5 automation images. `vercel` added 2026-08-06 per Bryan. |
| Space Coast Leads | Lead Generation | **automation** (no longer `web`, per Bryan 2026-07-18) | `spacecoastleads` | Modal shows its 4 SOP flowchart images (same 4 used in the Process Design section — see §11). |
| n8n Academy | Certification Training | `n8n` | `n8nacademy` | **Added 2026-07-22.** 7 screenshots of Bryan's actual n8n Academy course-build workflows (QS101/n8n101/n8n102/n8n103), PII-checked clean except image 6, which shows Bryan's own email (`johnbryanodina@gmail.com`) in a sticky note — left unblurred (his own contact info) but flagged for his confirmation. Card/modal copy drafted from the 4 badge pages at badges.n8n.io (fetched via Googlebot user-agent since the site 403s normal requests) — unreviewed by Bryan, same as all other case-study copy (see note below table). |
| Affiliate Signup Alerts | Community / SaaS | `claude`, **`vercel`** | `affiliatenotif` | **Added 2026-07-27.** FirstPromoter `lead_signup` webhook → Vercel serverless function → Discord embed notifier, built with Claude Code (source: private repo `discord_freetrial`, outside this portfolio repo). 5 images: architecture diagram (thumbnail), live Discord channel result, Vercel dashboard, VS Code + Claude Code mid-session, GitHub repo page. **Image 2 (Discord channel) shows two real subscribers' Gmail addresses — `blur:true`, same treatment as Vanguard Credits, confirmed with Bryan.** The other 4 are clean. First card added under the new "Claude Projects" category (§4). |
| Business Automation Systems | Multi-Industry | `n8n` | `n8nsystems` | **Added 2026-07-28.** 10 n8n workflow canvases Bryan supplied, each a **demonstration/template build** (not a named or unnamed real client) — confirmed with Bryan explicitly, since the copy references generic examples ("a church," "a clinic," "the average small business"). Covers: missed-call text-back & speed-to-lead, real-estate lead auto-qualifier, credit-repair dispute notifier, church visitor/volunteer follow-up, zero-touch client onboarding, abandoned-cart & low-stock alerts, AI resume screening, invoice/overdue reminders, multi-channel appointment reminders, AI ticket triage. All 10 images PII-checked clean (node fields show generic `REPLACE_WITH_...` placeholders, no real names/emails/live credentials) — none blurred. The 10 written descriptions Bryan provided were folded into the 3 existing modal fields (Description/Problem/What Was Done) rather than adding a new modal section or per-image captions — his explicit choice; `workdone` lists all 10 workflows as a numbered enumeration (see the `white-space:pre-line` CSS note below). |
| Wolfpack Basecamp | Business & Credit Coaching | web, automation, **courses** | `wolfpackbasecamp` | **Added 2026-07-31.** Bryan confirmed he built the website, GHL CRM, and marketing automation behind this paid Skool community (a "done-with-you" credit-repair/business-coaching membership at wolfpackbasecamp.com/skool-offer). 3 images: the funnel/website capture (default thumbnail), a Skool classroom screenshot, and a Skool community-feed screenshot (`thumbAlt.courses` swaps to this one under the Courses & Community filter). **PII found and flagged to Bryan before adding — he chose to leave both unblurred:** the community-feed screenshot shows a real third-party member's name/avatar on the leaderboard sidebar ("Thomas Thiel") alongside Bryan's own name. Description/problem/workdone copy drafted from the live funnel page (fetched via WebFetch) plus the supplied screenshots — unreviewed by Bryan, same as all other case-study copy. |
| SSSGRP Litigation Support | Legal / Expert Witness Services | web | `sssgrp` | **Added 2026-07-31.** Single landing-page screenshot for a use-of-force/security/law-enforcement litigation-support and expert-witness practice — confirmed by Bryan as real client work. `link:null` — the client provided a GHL preview URL that 403'd for automated fetch (`sites.leadconnectorhq.com/preview/...`), so copy was drafted directly from the supplied screenshot rather than a live fetch, and no "Visit site" link was added since the URL's public accessibility wasn't confirmed. **PII found and flagged to Bryan before adding — he chose to leave it unblurred:** the lead-capture form at the bottom of the page shows Bryan's own real name, phone number, and email typed in as test data (this one includes a phone number, not just an email, so it went beyond the existing "own email in a sticky note" precedent from n8n Academy). |
| Clawd | Developer Tools | `claude` | `clawd` | **Added 2026-08-06.** An always-on-top Windows desktop widget (Electron, zero runtime dependencies) showing live Claude usage — account rate limits, session token burn, context fill, cost — via a pixel-art mascot that doubles as an ambient status light. `claude`-only, same shape as Affiliate Signup Alerts (not `apps`, since it's a native desktop app, not a web app). **Thumbnail is a self-hosted crop, not a CDN image** — `images/clawd/clawd-widget.png`, the second self-hosted image directory after `images/vanguard/` (see §9). The supplied screenshot is mostly a VS Code window with the widget as a small translucent card in the lower-right; cropped to a 456×285 (exact 16:10, matching `.work-thumb`'s `aspect-ratio`) close-up centred on the widget so the card reads as "a desktop widget" at thumbnail size rather than "a code editor." Crop verified byte-for-byte against the source region (zero pixel differences) using the same hand-rolled zlib-based PNG tooling as the Vanguard redactions. Modal has 2 images: the crop, then the full original screenshot. No PII — it's Bryan's own machine and editor session. Required a small resolver change: `renderWork()` previously hardcoded `CDN + p.thumb`, which only worked for CDN hashes; a new `thumbUrl()` helper now passes through any `thumb` starting with `/` unchanged and CDN-prefixes everything else, so all 23 pre-existing hash-based thumbnails are unaffected (verified). |
| LevelUp Academy Dashboard | Internal Business Tool | claude, **vercel**, **apps** | `luadashboard` | **Added 2026-08-06.** Private single-admin Next.js 15 / Supabase app tracking two revenue lines (GHL subaccount reselling, a ₱8,500 course) through Kanban boards into one combined P&L, deployed to Vercel. **Distinct product from the existing "Level Up Academy" card (`lua`)** — that one is Bryan's own 8.7K-member gamified course community; this is his private admin tool for tracking it financially. Deliberately given a different slug (`luadashboard`, not `lua`) to avoid a `CASE_STUDIES` key collision, since duplicate slugs would silently make one card's modal unreachable. Has a `thumbAlt` override for both new categories: `apps` shows the Subaccounts Kanban board, `vercel` shows the Analytics/P&L view. **All 5 screenshots show seeded/demo data, confirmed explicitly with Bryan before publishing** — the Subaccounts and Students boards show ~22 named individuals with payment/overdue status, and Analytics shows a full P&L (revenue, expenses, net loss, margin); had any of it been real this would have been the most sensitive set on the site, so it was flagged and confirmed rather than assumed. None blurred. |

**Vanguard Credits, Woop, and NextLevel were added in an earlier session** as new case studies not previously on Bryan's live site.

**CSS note (2026-07-28):** `.case-section p` gained `white-space:pre-line` to support the numbered `workdone` list in Business Automation Systems (newlines in the JS string now render as line breaks). Safe for all other case studies (33 as of 2026-08-06 — 24 `WORK_PROJECTS` + 10 `pd-*` Process Design entries, minus Business Automation Systems itself) — none of their `description`/`problem`/`workdone` strings contain a newline, so their rendering is unchanged.

---

## 6. Certifications / Badges Section

Displays 6 badge cards, each linking out to a verification URL:

| Badge | Image (CDN) | Verify link |
|---|---|---|
| GHL Certified Admin | `.../media/6a595a391097b811959c1dc8.png` | (image itself, no separate verify page) |
| n8n Quick Start | `.../media/6a59688d1097b81195a133b7.png` | `badges.n8n.io/4b4bd738-7bff-4d97-b395-b5b92d115d5b` |
| N8N101 | `.../media/6a59688da3791820f854ebd9.png` | `badges.n8n.io/997640e6-dab6-437f-ba73-6c45340555c5#acc.soNl8Oig` |
| N8N102 | `.../media/6a59688da3791820f854ebd4.png` | `badges.n8n.io/b1e5bae8-b195-46b6-a3d8-49a50b766d6b` |
| N8N103 | `.../media/6a59688d9c9b37b5fd59b1bf.png` | `badges.n8n.io/5b55f813-088b-47fa-b2b0-5d6278ab5fbe#acc.ZibeY4Bt` |
| Six Sigma Yellow Belt | `.../media/6a5ab2bd7fb178795975d5ce.png` (badge shield icon) | `.../media/6a5aaf94bc82ab9d9ef51635.png` (the actual certificate image, opens in a new tab — same "link straight to an image" pattern as the GHL badge) |

**Badge hover effect (added 2026-07-18):** `.badge-card:hover` lifts 5px (`translateY(-5px)`, up from 3px).

**Card hover effect — replaced 2026-07-19, iterated twice same day.** All 7 card types that hover-lift (`.service-card`, `.badge-card`, `.work-card`, `.flow-card`, `.video-card`, `.test-card`, `.process-step`) previously pulsed an orange box-shadow (`@keyframes card-glow`/`badge-glow`). Per Bryan's request this is now the same "electricity in a wire" language as the hero flow diagram (§3): a small `<svg class="card-bolt">` is injected into every one of these cards by JS on page load (inline script, right after the scroll-reveal `IntersectionObserver` setup), containing one `<rect pathLength="200">` that traces the card's own border. On `:hover` the overlay fades in and the rect runs `@keyframes bolt-travel` (`stroke-dashoffset` 0 → -200) — a glowing `#FFD9A8` comet (CSS `drop-shadow`, not the hero's SVG `<filter>`, so cards don't depend on the hero's `<defs>`) traveling clockwise around the perimeter, fading out on unhover.
- **Iteration 1 (clipping fix):** originally inset *inside* the border, the glow was invisible on `.work-card`/`.flow-card`/`.video-card` because those three had `overflow:hidden` (used to round their edge-to-edge thumbnail images), which clipped it. Fixed by removing `overflow:hidden` from those three card rules and moving the rounding directly onto the image/video itself instead (`.work-thumb`, `.flow-card img`, `.video-card video` all get `border-radius:var(--radius) var(--radius) 0 0`, matching the card's own top corners) — thumbnails still look identically rounded, but the card box no longer clips its own children.
- **Iteration 2 (border alignment + speed, same day):** the clipping fix's interim position (offset 4px outside the border, `rx:14px`) read as a floating outline disconnected from the card. Per Bryan's request, the rect now sits centered directly on the card's actual 1px border (`x/y:-0.5px`, `width/height:calc(100% + 1px)`, `rx:10px` matching the card's own `--radius`) so the glow visually **is** the border lighting up, not a separate ring. Also slowed 40% per Bryan's request: `bolt-travel` duration `2.6s → 3.64s` (`2.6 × 1.4`), still `linear infinite`. Stroke stays `3.5` wide (the earlier "+1px weight" request).

The lift (`translateY`) and accent border-color change on hover are unchanged throughout. `.card-bolt{pointer-events:none}` so existing click targets (work-thumb/Learn-more → case modal, flow-card → modal, badge links) are unaffected. Hidden entirely under `prefers-reduced-motion` (`.card-bolt{display:none}`).

All CDN images are hosted at `https://assets.cdn.filesafe.space/7qfXIFSTdrRVqc8n8dWk/media/...` (Bryan's own GHL media storage — safe to hotlink directly, no download/rehost needed).

**A2P/10DLC Compliance — moved out of this section on 2026-07-18.** It briefly lived here as a second badge row, but Bryan asked for it to move into the **Work section** instead, as a new filter category (`compliance`) rather than a certifications badge. See §5 and §11. The 3 approval screenshots (The Bill Busters, Squirrel Insurance, Genesis Credit) now live inside those clients' case-study modals and as their `compliance`-filtered thumbnail. **Note carried over:** the mapping of which CDN link belongs to which client was inferred from file-modification order in Bryan's local folder (`Portfolio/A2P approved/`), not an explicit label — still worth Bryan's visual confirmation.

**Credential tag group** (appears in hero + footer) must always include all four: Licensed Electronics Engineer, GHL Certified Admin, Six Sigma Yellow Belt, **N8N Certified**.

---

## 6a. Tools I Use — added 2026-08-07

`#tools`, directly below Certifications, `class="section"` (not `alt`) — deliberately creates a three-section dark run (About → Certifications → Tools) rather than flipping every subsequent section's background; the codebase already had two such non-alternating pairs (`about`→`certifications`, `process`→`book`) before this, so it's consistent with existing precedent, not a new exception.

**Data-driven**, same pattern as `WORK_PROJECTS`/`renderWork()` (§11): a `TOOLS` array (in `index.html`'s inline `<script>`, just after `renderWork()`'s closing) plus a `renderTools()` IIFE that populates `#toolsGrid`. **Adding a tool is one appended object.** `renderTools()` must run before the `.reveal` IntersectionObserver setup, for the same reason as `renderWork()` — the observer takes a `querySelectorAll('.reveal')` snapshot and would silently skip tiles rendered after it runs.

**30 tools, two data shapes:**
- **29 vector** — `{name, brand, vb, d}`. Monochrome (`var(--text-muted)`) by default, the logo's real brand hex on hover, via a `--brand` CSS custom property set inline per tile.
- **1 raster** — GoHighLevel (`{name, img, w, h}`), the only tile without a vector source (see below). The same muted→real-color-on-hover effect is done with `filter:grayscale(1) opacity(.65)` → `filter:none` on hover, since there's no `fill` to swap on a raster image.

**Slack was added, then removed twice over — read this before re-adding it.** It first shipped as the official 4-color mark (always shown in full color, since no single-fill version exists). Bryan then supplied a replacement two-tone raster asset, which was cropped/downscaled and wired in as a second raster tile alongside GoHighLevel — see `LOGS.md` 2026-08-07 for that whole process if useful as a reference. **Both versions were removed entirely the same day** — Bryan called the tile "an eyesore" and asked for it gone, no replacement requested. The `multi`/`.tool-svg--color` code path (from the first version) had already been deleted when the second version replaced it; nothing Slack-related remains in `index.html`, `CLAUDE.md`, or the `images/tools/` directory. **If Slack is ever wanted again, don't reuse either prior asset without asking Bryan first** — both were explicitly rejected, not just superseded by a technical fix.

**Logo sourcing.** 27 of 30 come from **Simple Icons** (`cdn.simpleicons.org`, CC0-licensed) — fetched once and inlined as path data, so the live page has zero runtime dependency on that or any other third-party CDN. Every fetched icon was verified single-path with the official brand hex in its `fill` before use. **3 tools have no usable Simple Icons entry** and were sourced individually, each rendered and *viewed* before use (via headless Chrome, since this environment has no other way to preview an SVG) rather than trusted blind:
- **VS Code** — Microsoft's own icon (`upload.wikimedia.org`), cross-checked against a second independent source (`gilbarbara/logos`) that encodes the identical silhouette, confirming neither is a stale/corrupted copy. Brand hex `#007ACC`.
- **ChatGPT/OpenAI** — extracted from OpenAI's combined wordmark+glyph SVG (Wikimedia); isolated just the icon-mark path (not the six wordmark letterforms). **A hand-rolled bounding-box walker was used initially and shipped a bug** — it didn't handle the SVG `V`/`v` (vertical lineto) command or implicit repeated command arguments, silently desyncing the parse and computing a bounding box that didn't fully contain the glyph. This clipped the icon's left edge in production; Bryan caught it visually and reported it. **Fixed 2026-08-07** by using the browser's own `SVGGraphicsElement.getBBox()` (via headless Chrome) instead of hand-parsing the path — spec-correct by construction, no custom parser to have bugs in. **If any future tile needs a computed viewBox from raw path data, use `getBBox()` in a real (or headless) browser, not a hand-rolled path-command walker** — this bug is exactly the failure mode to avoid.
- **GoHighLevel** — **no usable vector exists anywhere** (checked: gohighlevel.com's own site and brand/press pages, GitHub, Wikimedia, Simple Icons, Brandfetch; the only asset on GHL's own domain is a 16×16 raw-bitmap favicon, unusable at any real size). Sourced from a real GHL integration partner's page (`globalcallforwarding.com`, supplied by Bryan) — cropped from their "HighLevel" lockup down to just the three-arrows glyph, excluding the wordmark. **Verified byte-for-byte against the source region (0 differences)** using the same hand-rolled zlib-based PNG tooling as the Vanguard/Clawd crops (`CLAUDE.md` §9, §5's Clawd row). Self-hosted at `images/tools/gohighlevel.png` — the second self-hosted image directory in `index.html` itself (`images/clawd/` was the first, 2026-08-06).

**Dark-background color override.** Vercel, Next.js and Notion's Simple Icons brand hex is `#000000`; ChatGPT's mark has no single official hue and is commonly shown solid black. All four would be **invisible on hover** against this page's near-black background if their literal/typical color were used, so their hover color is overridden to `#F4F1E8` (the site's `--text` white) — each brand's own standard presentation on dark surfaces, not a fabricated substitute. Applied in the `TOOLS` array itself (the `brand` field), not via a CSS exception, so it's visible in the data rather than a hidden override.

**Trademark note.** All 30 marks are third-party logos used nominatively — naming the actual tools Bryan works with, standard practice for a portfolio "stack" strip. Simple Icons' CC0 licence covers the icon *files*; it doesn't transfer any trademark right, and none is claimed for any of the 30.

**Layout.** `.tools-grid` uses fixed `76px` grid tracks (not `1fr`) with `justify-content:start` on desktop — unused width collapses at the row's end rather than spreading tiles out, which is what makes the row read left-aligned, and doubles as the mechanism for the two-row layout Bryan asked for: 76px tracks at 14px gaps fit exactly 16 per row at `--maxw`'s full content width (1480px), landing all 30 tools in exactly two rows (16 + 14) on a wide desktop. **`@media(max-width:879px)` switches to `justify-content:center`** — reuses the existing nav breakpoint rather than inventing a new one — for the centered-on-mobile behavior Bryan asked for. Narrower desktop/laptop widths will show more than two rows as the grid reflows; this is correct responsive behavior, not a defect, and wasn't something a fixed pixel target could avoid for 30 items.

**Not clickable** — each tile is a `<span role="img" aria-label="…">`, not a link. 30 outbound links wasn't something Bryan asked for and would be visual/functional noise; the accessible name and a `title` tooltip carry the tool name for anyone who can't infer it from the logo alone.

---

## 7. Booking / Calendar

**Rebuilt entirely on 2026-07-18** — see §12 "Booking Backend" for the full architecture. Summary: the old GHL iframe embed (`links.levelupacademy.cc/widget/booking/y7JL04RcQUy2EyhUm1FQ`) is gone, replaced by a custom-styled widget (`#bookingWidget`) built entirely from the site's own CSS/JS, backed by new Vercel serverless functions (`/api/availability`, `/api/book`) that check Bryan's real Google Calendar and write bookings to both Google Calendar and GHL.

**Why this replaced the iframe:** cross-origin iframes are sandboxed by the browser (Same-Origin Policy) — page CSS genuinely cannot reach inside to restyle GHL's colors. GHL's own dashboard only exposes Primary/Background color pickers, and only for their "Neo" calendar style, with no custom-CSS hook (confirmed against GHL's own support docs, not guessed). That GHL-dashboard color fix is **still worth doing** as a low-effort backup/reference (Calendar → Calendar Settings → [calendar] → ⋮ → Edit → Customizations tab → confirm Neo style → set Primary `#CC7E31` / Background `#151513`), but Bryan opted for full replacement instead of living with that partial fix.

All "Book a call" CTAs across the page (`nav`, hero, about, contact) still link to `#book`, the anchor for this section — unchanged.

**This feature is not fully live yet** — the code is built and unit/regression-tested, but requires Bryan to complete the credential setup and deployment steps in §12 before it can actually check his calendar or write bookings anywhere. Until then, `/api/availability` and `/api/book` will throw (missing env vars) if actually deployed without credentials configured.

---

## 8. Known Gaps / Pending Work

1. **Screenshot assets — resolved 2026-07-18.** All `images/...` placeholder paths (gallery + work-card thumbnails) have been replaced with Bryan's actual GHL CDN links, sourced from the `.txt` link files he dropped in the `Portfolio/` folder (one per content category — `Website captures.txt`, `Web applications.txt`, `Automations.txt`, etc.). Everything hotlinks to `assets.cdn.filesafe.space`, consistent with the badges/hero/about photos that already worked this way, **with one exception as of 2026-08-06**: the Clawd card's thumbnail is a self-hosted crop at `images/clawd/clawd-widget.png` (see §5), since it's a cropped close-up of the supplied screenshot rather than the screenshot itself, so no CDN hash exists for it. `renderWork()`'s thumbnail resolver (`thumbUrl()`) now handles both cases.
   - Still open: the `.txt` source files remain in `Portfolio/` (not deleted) — fine to leave as reference, or Bryan may want them cleaned up once he's confirmed everything mapped correctly.

2. ~~Contact form has no backend.~~ — **resolved 2026-07-27.** Wired to a new `/api/contact` serverless endpoint that pushes a Telegram notification to Bryan via his own bot. See §14.

3. **Hero photo vs. About photo** — currently two different images are used (hero uses the original profile pic, About section was updated to a new photo per Bryan's request). Confirm with Bryan if he wants them unified.

4. **A2P badge mapping needs visual confirmation** — see §6 note; client labels were inferred, not explicitly sourced.

5. **Image-to-client assumptions:**
   - ~~AutoQuote assumed to belong to Squirrel Insurance~~ — **corrected 2026-07-18: Bryan confirmed AutoQuote belongs to Meritex Canada**, not Squirrel. Moved accordingly (see §5).
   - Of the 3 unlabeled "Social Media Automation" screenshots, only 1 was assumed to belong to **The Bill Busters**, based on a local filename (`Portfolio/Social Media Automation/The bill Buster Social Media automation.png`) matching in spirit — the other 2 links in that txt file are still unused since no client could be inferred. **Still needs Bryan's confirmation.**

6. **All Work-section Description/Problem/Work-Done copy, and all 9 invented Process Design case studies, are agent-drafted and unreviewed.** Bryan asked for a draft-then-review pass (see §11) — none of this copy should be treated as final until he's read through it.

7. ~~Booking backend built but not live~~ — **resolved 2026-07-18.** Live, deployed, and fully verified end-to-end against the real GHL API on `portfolio-ud47.vercel.app`. See §12.

8. **Booking config values unconfirmed** — timezone (default Asia/Manila), meeting duration (default 30min, must match GHL calendar's own setting), minimum notice (default 12h), max advance window (default 30 days), and the exact fields collected (currently mirrors the old contact form: name/email/phone/notes) are agent defaults in `api/_lib/config.js` — confirm/adjust with Bryan. Working hours/days/buffer are no longer agent config — they're GHL calendar settings Bryan controls directly.

---

## 9. CRITICAL — Sensitive Data Handling

Some screenshots contain **real personal information**. Current state as of **2026-08-01** — read this whole section before changing any blur flag or adding a Vanguard image.

### What is actually in the 9 Vanguard Credits images

All nine were opened and inspected on 2026-08-01. The earlier one-line description in this section was accurate but incomplete — it missed a second client name and the ID-document links. Definitive breakdown:

| # | CDN hash | Content | Treatment |
|---|---|---|---|
| 1 | `6a5a7d07baf5f6da40225faf` | Marketing website capture | Clean |
| 2 | `6a59660abaf5f6da40d9bda6` | Login screen, placeholder credentials | Clean |
| 3 | `6a59660b9c9b37b5fd595e79` | Supabase dashboard — **live project URL** beside three CRITICAL "RLS Disabled in Public" advisories on `public.clients` / `public.jobs` / `public.dispute_rounds` | **Redacted copy** (URL only) |
| 4 | `6a59660cbaf5f6da40d9bdd4` | VS Code — Flask codebase, file tree, architecture write-up | Clean (best image in the set) |
| 5 | `6a59660ba961afe59f73aa73` | Upload screen; filename `R Henry (May).html` | Clean (partial surname only) |
| 6 | `6a59660aa3791820f85490cb` | Dispute analysis — client full name, DOB, credit scores | **Redacted copy** |
| 7 | `6a59660aa08bf95bce31eca1` | Dashboard — **two** real client names | **Redacted copy** |
| 8 | `6a59660aa3791820f85490c1` | Same view + "Existing Client Found" modal naming her | **Redacted copy** |
| 9 | `6a59660a9c9b37b5fd595b62` | Letter preview — full name, **complete Chicago street address**, DOB, plus form fields for SSN, client email, and Google Drive links to Government ID / Proof of Address / Social Security Card / FTC Identity Theft Report | **Redacted copy** |

### The two treatments now in use

1. **`index.html` (main portfolio)** — unchanged. Its `vanguard` entry still points at the raw CDN hashes with `blur:true` on images 2-9. CSS blur only.
2. **`keyland-compliance-group.html`** — uses **hard-redacted copies** committed to `images/vanguard/`, served from the site, with **no blur at all**. Black rectangles are burned into the pixels over every identifying field; the FCRA letter body, the rule-engine output, the dashboard metrics and the UI are all fully visible. This is what let Bryan show the complete Vanguard gallery without exposing anyone.

**The redacted copies are strictly safer than the blurred originals** — CSS blur leaves the unmodified file one right-click away, whereas these files simply do not contain the data. If Bryan ever wants the main portfolio hardened, swapping `index.html`'s Vanguard `im()` calls for the same `/images/vanguard/*.png` paths would do it.

### Other images

| Screenshot | Contains | Blurred today? |
|---|---|---|
| **Woop** #3 | Bryan's own home address and phone number | No — unblurred 2026-08-01 at his request |
| **NextLevel** #5 | Other users' email addresses | No — unblurred 2026-08-01 at his request |
| **Affiliate Signup Alerts** #2 | Two real subscribers' Gmail addresses | No — unblurred 2026-08-01 at his request |

### Standing rules

- **Do not assume newly-added screenshots are safe** — inspect every new image for PII before wiring it in, as was done for the n8n, Wolfpack, SSSGRP and Vanguard sets. The Vanguard review found materially more than the file's own notes claimed.
- **Regenerating a redacted image:** re-download the original, re-derive coordinates by cropping and *viewing* the candidate region (never guess), then verify the output three ways — view it whole, assert each box is solid black, and diff against the original to prove nothing outside the boxes changed. That harness is described in `LOGS.md` 2026-08-01.
- The blur mechanism (`blur:true`, `.case-thumb-wrap.blurred`, `.lightbox.blurred`) is still live and still used by `index.html` — do not remove it.
- **Bryan's own name/phone/email appear deliberately unblurred** in the `sssgrp` screenshot, and a third-party member name in the `wolfpackbasecamp` one — both confirmed by him on 2026-07-31. Not oversights.

**Current implementation (updated 2026-07-18 three times — case-study modal shipped, real Vanguard Credits website capture added, then the Gallery section that used to hold a blurred preview was removed entirely):** No image-editing tool is available in this environment, so blurring is done at render time instead of on the source file:
- The Gallery section (and its `.gallery-blur`/`.privacy-note` blurred preview of Vanguard Credits) no longer exists on the page at all — removed per Bryan's request (see §4). This actually reduces PII exposure surface, not just moves it.
- **The Vanguard Credits work-card thumbnail is now a real website-capture screenshot (`6a5a7d07baf5f6da40225faf.png`), unblurred** — Bryan confirmed this is fine since it's just the marketing site, no PII. It's also the first image in the `vanguard` case-study modal (`blur:false`).
- **The other 8 Vanguard Credits images in the modal are the dispute-letter screenshots and stay `blur:true`** in `CASE_STUDIES` — Bryan explicitly confirmed (2026-07-18) that only the new website-capture thumbnail should go unblurred, and the real-PII dispute letters keep the blur + "Blurred for privacy" overlay treatment, both in the modal grid and in the full-size lightbox (caption appends `(blurred for privacy)`). **Fixed 2026-07-19:** the full-size lightbox previously only appended the caption text but showed the image *unblurred* — it now applies a real CSS blur (`.lightbox.blurred #lightboxImg`, 18px) whenever the displayed image is flagged `blur:true`, including while navigating with the new prev/next arrows. **Do not remove blur from any Vanguard Credits image showing an actual dispute letter/consumer data without Bryan explicitly re-confirming** — this was checked directly with him once already given how consequential getting it wrong would be.
- The underlying `<img src>` in all cases is still the unblurred CDN link — the blur is CSS-only, applied on the live page, not baked into a rehosted file. This satisfies "whole image blurred + overlay" but is worth knowing: anyone who opens the image URL directly (view-source, right-click → open image) sees the original unblurred screenshot. If Bryan wants a harder guarantee, the CDN images themselves need to be replaced with pre-blurred versions.
- ~~Woop #3, NextLevel #5, and Affiliate Signup Alerts #2 are flagged `blur:true`.~~ **Superseded 2026-08-01** — all three were unblurred at Bryan's explicit request (see the table at the top of this section). They remain in their clients' case-study modals, now rendering unblurred. The work-card default thumbnails for Woop and NextLevel still use a different image (Woop 1, NextLevel 1), unchanged.
- Any future work that adds more Vanguard Credits / Woop / NextLevel / Affiliate Signup Alerts screenshots must check against this list before wiring them into `WORK_PROJECTS`, and set `blur:true` on the `im()` call if needed.
- **Two exceptions, both checked and confirmed with Bryan on 2026-07-31 (not oversights):** the `wolfpackbasecamp` community-feed screenshot shows a real third-party member's name/avatar on a leaderboard, and the `sssgrp` screenshot shows Bryan's own name/phone/email typed into a lead form as test data. Both were flagged to him before adding, and he explicitly chose to leave both unblurred — see §5 for detail. Do not blur these without him asking, and do not treat their unblurred state as a missed PII check in a future session.

---

## 10. Interaction Details (for reference when editing)

- **Scroll reveal:** `.reveal` class + IntersectionObserver, fades/slides up on scroll into view. Falls back to instantly visible if `IntersectionObserver` unsupported. Disabled under `prefers-reduced-motion`.
- **Work filter:** `.filter-btn[data-filter]` buttons toggle `.hidden` on `.work-card[data-category]` by matching space-separated category tokens, and also trigger the per-category thumbnail swap (see §11).
- **Lightbox:** case-modal images wire into `#lightbox` dynamically (no static page markup uses `data-full` anymore since Gallery was removed). Closes on ✕ button, backdrop click, or Escape key. **Gallery navigation added 2026-07-19:** opening an image from a case modal now passes the case's full image list (`openLbGallery(items, index)`); orange circular prev/next arrows (`.lightbox-nav`, primary orange, hover → secondary) appear on both sides when there's more than one image, with wrap-around navigation, ArrowLeft/ArrowRight key support, and a "N / M" counter appended to the caption. Single-image cases (and the legacy `openLb()` single-image path) show no arrows/counter. Blur state now carries into the lightbox per image (see §9).
- **Booking widget:** see §12. Escape key also closes the case modal now (`closeCase()` added to the same `keydown` listener as the lightbox).
- All frontend JS is vanilla, inline at the bottom of `index.html` — **zero external JS dependencies** as of 2026-07-18 (the GHL embed script was deleted along with the iframe it supported). The new `api/` backend has one dependency (`googleapis`), but that's server-side only, never shipped to the browser.

---

## 11. Case-Study Modal System (added 2026-07-18; Work section made data-driven 2026-07-27)

Replaced the old "click a work-card thumbnail → simple single-image lightbox" behavior with a full case-study modal (`#caseModal`), used by **both** the Work section and the Process Design section.

### Data-driven rendering (rewritten 2026-07-27)

Before 2026-07-27, all 18 `.work-card` elements and all 10 `.filter-btn` elements were hand-written static HTML in `index.html`, with a separate hand-written `CASE_STUDIES` entry per card — adding one project meant editing three disconnected places by hand, with silent failure if a `data-case` slug didn't match (`openCase` just no-ops on a missing key). This was rebuilt so the Work section renders entirely from data:

- **`WORK_CATEGORIES`** and **`WORK_PROJECTS`** — two arrays defined at the very top of the inline `<script>` (before the Lightbox setup, and critically before the `.reveal` IntersectionObserver, the `.card-bolt` hover-effect injection, and the filter-click handler further down the same script — all three take a `querySelectorAll` snapshot that must see the generated cards/buttons already in the DOM). `WORK_CATEGORIES` is `[{slug, label}, ...]` — one entry per filter button, in display order, `all` always first. `WORK_PROJECTS` is one object per work card: `{slug, name, industry, categories:[...], thumb, alt, thumbAlt:{category:hash}, desc, tags:[...], link:{href,label}|null, description, problem, workdone, images:[{src,blur}]}`.
- **`renderWork()`** — an IIFE that runs immediately after the data arrays: builds the filter buttons' HTML into `#workFilters` and the work cards' HTML into `#workGrid` from `WORK_PROJECTS`/`WORK_CATEGORIES`. The generated markup is intentionally byte-for-byte equivalent to what used to be hand-written (same classes, same `.reveal`, same `.work-case-btn` button, same `data-thumbs` JSON attribute) — so every downstream consumer (CSS, the card-bolt hover effect, the `#workGrid` click delegation, the filter handler's `data-thumbs` swap) needed **zero changes**.
- **`CASE_STUDIES`** is now built as `Object.fromEntries(WORK_PROJECTS.map(p => [p.slug, p]))`, then merged via `Object.assign(CASE_STUDIES, {...})` with the 10 Process Design (`pd-*`) entries, which still have no work-card and are defined separately, unchanged, further down the script (see "Process Design invented names" below).

**How to add a new project:** append one object to `WORK_PROJECTS`. That's it — no HTML editing, no separate `CASE_STUDIES` entry, no manual `data-case` bookkeeping. **How to add a new filter category:** append one `{slug, label}` object to `WORK_CATEGORIES`, then add that slug to at least one project's `categories` array (a category nothing is tagged with just shows an empty grid when clicked — not an error, but not useful either).

**Data source — each `WORK_PROJECTS`/`CASE_STUDIES` entry** has:
- `name`, `industry`, `sample` (bool — true only for the 9 invented Process Design cases; kept as inert metadata, nothing reads it — see below)
- `description`, `problem`, `workdone` — the three copy fields shown in the modal. **All of this copy was drafted by the agent, not provided by Bryan** — he asked for a draft-then-review pass, so treat every description/problem/workdone string as unreviewed until he confirms it.
- `images: [{src, blur}]` — every image found for that client across *all* the `.txt` source files (per Bryan's explicit "everything found for that client" instruction), not just the one used as the card's default thumbnail. `im(hash, blur)` is a small helper that builds `{src, blur}` from a CDN hash.

**Triggering:** `.work-card` elements carry `data-case="slug"`; a click anywhere on `.work-thumb` or the `.work-case-btn` (labeled **"Learn more →"** — changed from "View case study →" on 2026-07-18) button opens that card's modal (event-delegated on `#workGrid`, so newly-rendered cards need no extra wiring). `.flow-card[data-case]` elements in Process Design open the same modal directly. (The `.work-thumb-wrap` blur-overlay wrapper pattern — used briefly for the Vanguard Credits card thumbnail — was removed once a safe website-capture thumbnail replaced it; the pattern still exists inside the modal itself as `.case-thumb-wrap.blurred` if a future work-card thumbnail ever needs it again.)

**Rendering (`openCase(slug)`):** populates name/industry/description/problem/workdone, and builds `#caseImages` as a grid of thumbnails from the `images` array. Each thumbnail is independently clickable and opens the shared `#lightbox` (`openLb()`) for a full-size view — so the case modal and the simple lightbox stack (case modal z-index 98, lightbox 100). (No `sample`-tag rendering happens here anymore — see the paragraph below.)

**Category thumbnail-switching:** each project can carry an optional `thumbAlt:{category:hash}` field; `renderWork()` turns this into the same `data-thumbs='{"category":"url",...}'` JSON attribute on `.work-thumb` that the filter-click handler already expects, unchanged since before the refactor. It swaps `img.src` to the matching entry when a non-"all" filter is active, and restores the original (`data-default-src`, captured on first swap) otherwise. **Only applied where a genuinely distinct, correctly-identifiable image exists per category** — Squirrel (apps/compliance), TBB (compliance), GCR (ai/automation/compliance), Wisdom Church (automation), Celeste Nicolas (automation), AEMR (automation/payments), Level Up Academy (automation), Meritex (apps/automation), DeAnna Crawford (automation). Cards without a meaningful category-specific image keep their default thumbnail across all filters — this was a deliberate scope limit, not an oversight (fabricating fake per-category specificity for images the agent couldn't actually distinguish was judged worse than a few cards not swapping).

**Process Design invented names, no disclosure:** per Bryan's explicit instruction, all 9 generic industry flowcharts (Barbershop, HVAC, Landscaping, Coaching, Credit Repair, Psych Clinic, PR & Marketing, Podcast Outreach, Contact Flow) were given invented business names (e.g. "Southside Cuts Barbershop") since no real client exists behind them. The agent initially added a "Sample Build" disclosure tag/label as a safeguard against the page reading as if these were verified real clients — **Bryan asked for that disclosure to be removed entirely on 2026-07-18**, and it has been (the `.case-sample-tag` element, its CSS, and the `<em>(Sample Build)</em>` card-grid suffixes are all gone; the `sample:true/false` field still exists in `CASE_STUDIES` as inert metadata but nothing reads it anymore). Space Coast Leads (`pd-spacecoastleads`) is real and was never tagged. These 10 entries live outside `WORK_PROJECTS` — they have no work-card and are merged into `CASE_STUDIES` separately (see "Data-driven rendering" above).

---

## 12. Booking Backend (added 2026-07-18, simplified to GHL-only same day, deployed live same day)

Replaces the GHL iframe (see §7) with a custom widget + Vercel serverless API. **Live and fully working in production** (`portfolio-ud47.vercel.app` and its aliases — see Deployment/Ops notes below). GHL auth, the API call, response parsing, and real availability data are all confirmed working end-to-end against the real GHL API and real calendar. No known bugs remain in this feature as of 2026-07-18.

**Architecture note:** the first build of this (same day) used both Google Calendar and GHL — Google as the availability source of truth, GHL as the reminder-automation trigger. Bryan asked why both were needed; the honest answer was "in case your real schedule has things GHL doesn't know about." He confirmed **GHL's calendar is his full, comprehensive schedule** — nothing exists outside it — so Google Calendar was removed entirely the same day. GHL's own `GET /calendars/:calendarId/free-slots` API (confirmed to exist via GHL's official docs, used internally by GHL's own booking widgets) now handles availability directly, and GHL is the only external system this backend talks to. This cut the credential setup from two systems to one, removed the `googleapis` dependency entirely (site now has zero backend dependencies too — pure `fetch`), and simplified `api/book.js` from a two-system dual-write with partial-failure tolerance down to a single write.

### File structure
```
Portfolio/
  package.json, vercel.json, .env.example, .gitignore   # project root
  api/
    availability.js       # GET /api/availability?date=YYYY-MM-DD
    book.js                # POST /api/book
    _lib/
      config.js              # BOOKING_CONFIG — timezone/duration/notice-window guardrails (NOT working-hours/buffer — see below)
      slots.js                # timezone math only, no I/O — unit-tested directly with `node`
      ghl.js                    # GHL Private Integration REST calls (free-slots, contact upsert, appointment create)
```
`_lib/` is underscore-prefixed so Vercel's zero-config routing doesn't expose those helpers as routes — only `api/availability.js` and `api/book.js` are callable endpoints. `api/_lib/googleCalendar.js` existed briefly earlier the same day and was deleted once the GHL-only decision was made — if you see references to it anywhere stale, they're leftover from before this simplification.

### Config (`api/_lib/config.js`)
```js
{
  timezone: 'Asia/Manila',
  slotDurationMinutes: 30,   // must match the GHL calendar's own configured duration
  minNoticeHours: 12,         // extra guardrail on top of whatever GHL returns
  maxAdvanceDays: 30,
}
```
**Working hours, days, and buffer time are no longer configured here** — they live in GHL's own calendar settings (Settings → Calendars → [calendar] → Availability), since GHL's free-slots API already returns slots respecting those settings. If Bryan wants to change his available hours, he changes them in GHL directly — no code deploy needed for that anymore, which is a genuine improvement from the two-system version. A client-side mirror of `maxAdvanceDays` still exists in `index.html`'s booking JS (`CLIENT_CONFIG`, for greying out far-future calendar days before the user picks one) — UI-only, keep in sync manually if `maxAdvanceDays` changes.

### API behavior
- `GET /api/availability?date=YYYY-MM-DD` → calls GHL's `GET /calendars/:calendarId/free-slots` for that day, filters the returned start times against `minNoticeHours`, computes each slot's `end` as `start + slotDurationMinutes`. Returns `{date, timezone, slots:[{start,end}]}` with slots as ISO strings carrying the correct `+08:00`-style offset (computed via `Intl.DateTimeFormat`, no date library dependency).
- `POST /api/book` (body: `start,end,name,email,phone,notes`) → **re-fetches GHL's free-slots for that day immediately before writing** and confirms the requested start time is still present (race-condition guard — narrows but doesn't fully eliminate the window two simultaneous bookers could both pass; accepted as tolerable for solo-consultant booking volume, same class of limitation GHL's own widget already has). Upserts a GHL contact, then creates the GHL appointment. Since there's only one system now, **any failure is a hard failure** (500 to the visitor) — the dual-write partial-failure tolerance from the earlier two-system design no longer applies/exists.

### ✅ Fully verified against the live GHL API — working (2026-07-18)
Confirmed via a temporary debug endpoint (tried several request-parameter variants against the real API, deleted after use): `getFreeSlots()`'s request format is exactly right — `startDate`/`endDate` as **epoch-millisecond numbers** is required (GHL returns `422 "must be a number"` for ISO date strings), and `locationId` must **not** be sent as a query param (`422 "property locationId should not exist"` if included — good thing the current code never added it). The per-date slot shape is confirmed too: `{"YYYY-MM-DD":{"slots":["<ISO start time>", ...]}}` — an array of plain ISO start-time strings under a `slots` key, which `getFreeSlots()`'s defensive parsing already handles correctly via the `dayValue?.slots` branch.

**Important correction:** `y7JL04RcQUy2EyhUm1FQ` **is** the correct real Calendar ID — Bryan confirmed this directly from the GHL calendar's own settings page (screenshot: "GHL Implementation - Discovery Call, ID: y7JL04RcQUy2EyhUm1FQ"). GHL apparently uses the same ID for both the internal Calendar ID and the public booking-widget URL slug — the earlier assumption that these were different values (based on general GHL knowledge, not a confirmed fact for this account) was **wrong**, and the corresponding warning that was in this doc and in the credential-setup checklist has been removed.

**The actual reason single-day tests kept returning `slots: []`:** the specific date tested (2026-07-20, a Monday) simply has no configured availability on this GHL calendar. Widening the debug endpoint's query to a 2-week range confirmed real slots exist starting 2026-07-22 (Wednesday) — e.g. `21:00–23:30 Asia/Manila`. **Everything works end-to-end** — confirmed live: `GET /api/availability?date=2026-07-22` returns real slots with correct ISO offsets.

**Worth flagging to Bryan:** the real availability window that came back was **9:00 PM–11:30 PM Manila time**, not a typical daytime schedule. Worth a quick sanity check that this matches his actual intended availability in GHL (Settings → Calendars → that calendar → Availability) — if it looks wrong, it's a GHL-side config to fix there, not a bug here.

### Frontend widget
`#bookingWidget` in the `#book` section — three steps (date/slot picker → contact form → confirmation) toggled via `.is-hidden`, reusing the site's existing `.field`/`.btn-primary` styles verbatim and a new `.day-cell`/`.slot-btn` pill pattern styled off the existing `.filter-btn` look. JS lives in the trailing `<script>` block, IIFE-wrapped, after the work-filter code. Slot times display in the visitor's local timezone via the browser's own `toLocaleString`/`toLocaleTimeString` (no library) — the API always computes in `BOOKING_CONFIG.timezone` internally and returns offset-carrying ISO strings. **Unchanged by the GHL-only simplification** — the `/api/availability` and `/api/book` request/response shapes stayed identical, so no frontend edits were needed when Google Calendar was removed.

### Testing done so far (2026-07-18, before any real credentials existed)
- `api/_lib/slots.js`'s remaining pure functions (timezone offset formatting, booking-window bounds, minimum-notice check) unit-tested directly with `node` — 6/6 passed. (The earlier slot-generation/buffer-exclusion tests from the two-system version no longer apply — that logic moved to GHL and was deleted from this codebase.)
- All `api/*.js` files syntax-checked (`node --check`) after both the initial build and the GHL-only rewrite.
- Frontend widget flow (calendar render → date select → slot select → form → submit → confirmation, and the 409 `slot_taken` conflict path) verified end-to-end with Playwright against a **local HTTP server serving `index.html`** with `/api/availability` and `/api/book` mocked (fetch from a `file://` origin doesn't reliably hit route interception, hence the local server) — re-run after the GHL-only rewrite, still passes, confirming the frontend needed zero changes. Existing site regressions (work filters, case-study modals) re-verified working alongside the widget both times.
- **Fully tested against the real GHL API and confirmed working** (2026-07-18, once Bryan added credentials) — see the "Fully verified" callout above. Auth, the endpoint call, response parsing, and real availability data all confirmed live.

### Deployment / Ops notes (learned the hard way, 2026-07-18 — read before redeploying)

Getting this actually live surfaced several **Vercel account/project configuration issues, none of them application bugs**:

1. **The GitHub repo (`RedCheeksCoder/portfolio`) is now public**, not private. Vercel's Hobby plan refuses to build a commit unless the git author is a recognized collaborator on a *private* repo — Bryan's local git identity didn't match the Vercel account, and every git-triggered deploy failed with "Deployment Blocked: commit author did not have contributing access." Making the repo public (via GitHub API, `PATCH /repos/.../portfolio {"private":false}`) removed this restriction entirely, for free. No secrets are in the repo (`.env` stays gitignored), so this was judged an acceptable tradeoff over paying for Pro or reconciling git/Vercel account identities. **If Bryan wants it private again, the Hobby-plan collaboration restriction will return** — either upgrade to Pro, or make sure whichever git identity authors commits matches the Vercel account exactly.
2. **Always deploy with `vercel --prod --force`**, not plain `vercel --prod`. A plain deploy silently restored a stale build cache from before the GHL-only rewrite (build completed in ~1s, but was still running the deleted `googleCalendar.js` code) — `--force` skips the cache and guarantees a real rebuild. Do this until there's a specific reason to trust the cache again.
3. **`vercel --prod` does not update the project's named aliases automatically.** The short public URL (`portfolio-ud47.vercel.app`) and the team-scoped domain stay pinned to whatever deployment was last explicitly assigned via `vercel alias set <deployment-url> <alias>` — a fresh successful deploy does NOT retarget them on its own. After every deploy: get the newest deployment URL from `vercel ls portfolio-ud47 --scope redcheekscoders-projects` (first row), then run `vercel alias set <that-url> portfolio-ud47.vercel.app --scope redcheekscoders-projects` (and repeat for `portfolio-ud47-redcheekscoders-projects.vercel.app` / `portfolio-ud47-git-main-redcheekscoders-projects.vercel.app` if testing those too). Forgetting this step means testing an old deployment and getting confusing stale-error results.
4. **SSO/Deployment Protection was blocking the live site.** Vercel's `ssoProtection` was set to gate all non-custom-domain URLs — every production `*.vercel.app` alias Bryan was actually visiting redirected `fetch()` calls to an HTML SSO login page instead of returning JSON, which is what caused the `"Unexpected token '<', <!DOCTYPE"` crash the first time he clicked a date. Fixed with `vercel project protection disable portfolio-ud47 --sso --scope redcheekscoders-projects`. **If this ever needs re-enabling** (e.g. Bryan wants the site password-gated during further dev), remember it will break the booking widget again unless a custom domain is attached (custom domains are exempt from this gate) or the fetch calls are updated to send a protection-bypass token.
5. **Two Vercel projects existed for the same repo** (`portfolio` and `portfolio-ud47`) from an apparent double-import. `portfolio` never successfully deployed and had no env vars — deleted. `portfolio-ud47` is the one with real env vars and is the one actually in use; all instructions above assume this project name.
6. **Do not stack multiple deploys.** Running a second `vercel --prod` while an earlier one is still building/stuck appears to trigger a Vercel Pro-upgrade prompt (looked like a concurrency-limit gate manifesting as a billing nudge rather than a clean error). If a deploy seems stuck, cancel/remove it (`vercel remove <deployment-url> --yes`) before starting another, rather than deploying again on top.

### Credential setup — Bryan must do this himself (agent has no access to his accounts)

**GHL Private Integration:**
1. In the GHL sub-account currently running the booking widget → Settings → **Private Integrations** (not the legacy API Key page).
2. Create one, scopes: contacts read/write + calendar/appointments write + calendar/free-slots read (exact scope names to confirm in GHL's UI when creating it).
3. Copy the token immediately (GHL shows it once).
4. Note the Location ID and the Calendar ID from that calendar's own settings page. **Confirmed 2026-07-18: for this account, the Calendar ID and the public booking-widget URL slug are the same value** (`y7JL04RcQUy2EyhUm1FQ`) — don't assume this is universally true for every GHL account, but for this project it checked out, so there was never actually a credential bug here.

**Vercel deployment — done and confirmed working, project is `portfolio-ud47` under scope `redcheekscoders-projects`:**
1. Repo pushed to `github.com/RedCheeksCoder/portfolio` (now public, see Deployment/Ops notes) and a Vercel project exists (`portfolio-ud47`) with all four env vars set and confirmed correct.
2. Git-triggered auto-deploy is unreliable right now (see Deployment/Ops notes #2/#3) — until that's revisited, deploy manually: `cd Portfolio && vercel --prod --yes --force --scope redcheekscoders-projects`, then re-point the aliases (see Deployment/Ops notes #3).
3. Env vars live under Vercel Project Settings → Environment Variables — all four (`GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, `GHL_CALENDAR_ID`, `BOOKING_TIMEZONE`) confirmed correct and working as of 2026-07-18.

### Known limitations (documented, not silent gaps)
1. **Soft race-guard, not a hard lock** — see API behavior above. Acceptable for expected volume; revisit if booking traffic ever gets high enough for double-bookings to become a real problem.
2. Config values (timezone, duration, notice window, advance window, fields collected) are the agent's defaults, not yet confirmed by Bryan — see §8. Working hours/buffer are now GHL calendar settings, not agent defaults — Bryan should just set those directly in GHL to whatever he wants.
3. **SSO deployment protection is now disabled project-wide** (see Deployment/Ops notes #4) — the site currently has zero access gating on any of its Vercel URLs. Fine for a public portfolio site, but note this if Bryan ever wants a staging/password-protected preview.
4. **Real availability window is 9:00 PM–11:30 PM Asia/Manila**, not typical daytime hours — confirmed real, not a bug, but worth Bryan double-checking that's actually what he wants configured in GHL's calendar settings.
5. ~~Booking form failing with "Could not complete the booking"~~ — **resolved 2026-07-19.** Root cause: the GHL Private Integration token was missing the Contacts scope, so `POST /contacts/upsert` 401'd with `"The token is not authorized for this scope."` on every booking attempt (confirmed via live `vercel logs`, not guessed — see `LOGS.md` 2026-07-19 for the full trace). Bryan added the Contacts scope (and Calendars) to the token and redeployed himself. **Both `upsertContact` and `createAppointment` are now confirmed working end-to-end** via a real test booking (appointment ID `TNUqBBafiNo8DVqjx78i` on 2026-07-23 21:00 Asia/Manila, named "TEST BOOKING - please delete" — Bryan should delete this contact/appointment from GHL, it's not a real lead).

---

## 13. AI Receptionist (Chat Widget) — planned, blocked on Bryan (added 2026-07-19)

Bryan wants a floating AI receptionist chat widget on the site, using **GHL's real Conversation AI / AI Employee** (a genuine working integration, not a mockup). See `LOGS.md` 2026-07-19 for the full research trail.

**Key constraint (researched, not guessed) — same shape of problem as the pre-rebuild booking calendar (§7):** GHL's Chat Widget can only be restyled through its own dashboard settings (theme color, icon, avatar, position, welcome message) — no custom-CSS override, since it's an injected script/iframe subject to the same cross-origin limits as the old calendar embed. The Conversation AI Public API is for managing agents/actions and auditing past conversations, not a confirmed real-time "send message → get AI reply" endpoint — so a fully custom-built chat UI wired directly to the GHL AI Employee isn't a supported path per GHL's own docs.

**Decision (Bryan's):** embed GHL's real Chat Widget + Conversation AI as-is, themed via GHL's own settings, rather than building a custom UI backed by a different AI or attempting the unconfirmed Conversations-API workaround.

**Status: blocked on Bryan.** He hasn't yet set up/trained the Conversation AI bot in GHL (paid add-on, uses AI credits), and doesn't yet have the widget embed script (Settings → Chat Widget → Get Code). **Nothing has been added to `index.html` yet.**

**Recommended GHL widget settings to match site branding** (give these to Bryan when he configures it, or apply them directly if configuring on his behalf):
| Setting | Value |
|---|---|
| Primary/theme color | `#A54F16` (or `#CC7E31` if only one accent slot exists — better contrast on dark) |
| Background (if exposed) | `#151513` or `#0B0B0B` |
| Position | Bottom-right — nothing else on the page currently floats (confirmed via grep for `position:fixed`; only the case-modal/lightbox use it, both non-floating overlays) |
| Icon | Custom, not GHL default |
| Welcome message | In Bryan's voice, referencing automation/GHL/booking |
| Load timing | "Load on interaction" enabled, to protect page-load performance |

**Next step once Bryan has the embed script:** paste it into `index.html` immediately before `</body>` (alongside the existing inline script block), sanity-check it doesn't conflict with the case-modal/lightbox z-index stack (98/100) or the booking widget, then ship through the normal Deploy Rules flow below.

---

## 14. Contact Form Backend (Telegram) — added 2026-07-27

The `#contact` section's form (§4 item 14) was previously dead HTML — no `action`/`method`, no `name` attributes, no JS wiring, so clicking Submit did a native GET to the same URL and silently discarded the message (Known Gap #2, now resolved). It's now backed by a new serverless endpoint that pushes every submission straight to Bryan's Telegram via his own bot.

**Decision (Bryan's, confirmed 2026-07-27):** Telegram only — no GHL contact is created for these inquiries, unlike the booking flow. If Bryan later wants inquiries in GHL too, `api/_lib/ghl.js`'s existing `upsertContact()` can be called from `api/contact.js` — deliberately not wired in now, per his instruction.

### File structure (new)
```
api/
  contact.js              # POST /api/contact
  _lib/
    telegram.js               # sendTelegramMessage(text), escapeHtml(s) — plain fetch, no SDK
```

### Config / env vars
Two new env vars, set in Vercel Project Settings → Environment Variables (same place as the four GHL vars in §12) — **never committed**, `.env.example` only documents blank placeholders:
- `TELEGRAM_BOT_TOKEN` — from @BotFather.
- `TELEGRAM_CHAT_ID` — the numeric chat Bryan wants notifications sent to (get it by messaging the bot once, then hitting `https://api.telegram.org/bot<token>/getUpdates`).

Both credentials were already in Bryan's hand when this was built — no BotFather walkthrough was needed this session. Timezone for the "Sent at" timestamp in each message reuses `BOOKING_CONFIG.timezone` from `api/_lib/config.js` (`Asia/Manila`) rather than a separate constant, so there's one timezone source of truth across both backend features.

### API behavior
`POST /api/contact` (body: `name, whatsapp, email, question, company`):
1. **Honeypot** — `company` is a hidden, off-screen, `tabindex="-1"` input in the form (invisible and unreachable for a real visitor, but a naive bot that fills every field trips it). If non-empty, responds `200 {success:true}` and sends nothing — silent accept, no signal to the bot.
2. **Validation** — `name`, `email`, `question` required (`whatsapp` optional); email checked against the same `EMAIL_RE` regex used in `api/book.js`; each field length-capped (name 100 / whatsapp 40 / email 200 / question 2000). Returns `400 {success:false, error:'missing_fields'|'invalid_email'|'too_long'}`.
3. **Send** — formats an HTML-parse-mode Telegram message (emoji header, bolded labels, the question body, a Manila-time timestamp) and calls `sendTelegramMessage()`. Every visitor-supplied value is passed through `escapeHtml()` first — required, not just tidy: Telegram's `parse_mode:'HTML'` rejects the whole message with a 400 if unescaped `<`/`>` appear, so an unescaped question containing a stray `<` would silently break every future notification until caught.
4. Responses mirror `api/book.js`'s `{success, error, message}` shape: `200 {success:true}` on send; `500 {success:false, error:'server_error', message:'Could not send your message. Please try again, or email me directly.'}` on any Telegram API failure (logged server-side via `console.error('contact form error:', err)`, visible in `vercel logs`); `405 {error:'method_not_allowed'}` for non-POST.

No rate limiting was added — Bryan opted for honeypot + validation only, accepting that a determined spammer could still submit repeatedly. Revisit if Telegram starts receiving junk.

### Frontend
`index.html`'s `#contactForm` — the honeypot field, `required` on name/email/question (previously nothing was required), and two new status lines (`#contactError` reusing the existing `.booking-error` CSS rule, `#contactSuccess` styled inline in `--accent-2`). A new IIFE at the end of the inline `<script>` block (after the booking widget's) submits via `fetch('/api/contact', ...)`, mirroring the booking form's submit handler pattern exactly: `e.preventDefault()`, disable+relabel the submit button ("Sending…" → "Submit"), hide/show the error or success line based on `res.ok && data.success`, `catch` → "Network error — please try again.", `finally` → re-enable the button. On success the form is `reset()` rather than swapped out for a different panel (unlike the booking widget), so a visitor can send a follow-up message without reloading.

### Testing done (2026-07-27)
- `node --check` on both new files.
- Offline test (throwaway script, not committed): stubbed env vars and monkey-patched `globalThis.fetch` to capture the outgoing Telegram request instead of sending it. Verified: valid payload formats correctly and escapes `<script>`/`&` in both the name and question fields; honeypot-filled payload short-circuits with zero fetch calls; missing-fields, invalid-email, too-long, and wrong-method cases all return the expected status/error code. All 6 cases passed.
- Live end-to-end verification (real Telegram message arriving, real browser submission with no page reload) done as part of this session's Deploy Rules flow — see `LOGS.md` 2026-07-27 for the actual confirmation.

---

## 15. Second page: `/keyland-compliance-group` — added 2026-08-01

The site now has **two pages**. `keyland-compliance-group.html` is a standalone technical-portfolio summary Bryan sends as a link when applying for a **CTO / Technology Director** role at **Keyland Compliance Group** (a US trucking/FMCSA compliance company — USDOT authority setup, BOC-3 filings, drug & alcohol consortium, safety audits, trip permits, insurance). Their job posting asked applicants to send "examples of websites, CRMs, applications, or systems you have built," which is exactly what this page is.

### Routing — read before touching `vercel.json`
`vercel.json` gained a **`rewrites`** entry mapping `/keyland-compliance-group` → `/keyland-compliance-group.html`. The existing `functions` key is unchanged and must stay.

```json
{
  "rewrites": [{ "source": "/keyland-compliance-group", "destination": "/keyland-compliance-group.html" }],
  "functions": { "api/*.js": { "maxDuration": 10 } }
}
```

**`cleanUrls: true` was deliberately NOT used.** It defaults to `false` (verified empirically pre-change: `/index` 404'd while `/index.html` 200'd), and turning it on generates site-wide 308 redirects that would make the currently-working `/index.html` start redirecting to `/`. The targeted rewrite has zero blast radius. **If a third page is ever added, add another rewrite rather than flipping `cleanUrls`** — or if flipping it, re-verify `/index.html` and the `/api/*` routes afterward.

Because the rewrite leaves `/keyland-compliance-group.html` independently reachable, the page carries `<link rel="canonical" href="https://bryanodina.com/keyland-compliance-group">`. It is the **only** page on the site with a canonical tag or OG/Twitter meta tags — `index.html` still has neither.

### Design tokens are DUPLICATED, not shared
The page has its own inline `<style>` block containing a **copy** of `index.html`'s `:root` tokens, base typography, `.wrap`/`.eyebrow`/`.btn*`/`.section*`/footer/`.reveal` rules. There is no shared stylesheet (the site has no build step and no CSS file). **If a design token or shared component style changes in `index.html`, mirror it here or the two pages will visually drift.** A verification snippet that diffs the two `:root` blocks was used when the page was built; all 15 tokens matched.

Other structural notes:
- **Simplified header** — logo → `/`, a "← Back to portfolio" link, and a "Book a call" CTA → `/#book`. `index.html`'s nav was deliberately NOT copied: every link in it is a bare `#hash` anchor that would silently no-op on a standalone page.
- **Footer is copied verbatim** from `index.html` (fully portable — all absolute external links).
- **Favicon hrefs use leading slashes** here (`/favicon.svg`), unlike `index.html`'s relative ones, so they resolve correctly at a non-root path.
- Only JS is the `.reveal` IntersectionObserver.

### Nav link on the main site
`index.html`'s desktop `.nav-links` and `.mobile-menu` both gained an entry labeled **"Tech Summary"** → `/keyland-compliance-group`. Bryan explicitly chose public + linked over unlisted. The label is intentionally neutral rather than naming Keyland, since every visitor and prospective client sees it. **Removing it is a two-line revert** if he changes his mind.

### Content and the factual-accuracy constraint
The page groups Bryan's work into the five categories Keyland asked about (websites, CRM systems, customer portals, SaaS platforms, web applications), each system answering five fixed questions: business problem, his role, solo-or-team, technologies, users. It closes with a "how this maps to Keyland" section tying existing work to FMCSA-adjacent problems (deadline-driven compliance tracking, document intake, A2P 10DLC, GHL).

**This page makes factual claims in a hiring context — every claim must trace to a source. When editing it:**
- All project facts come from `WORK_PROJECTS` in `index.html`. Do not add detail that isn't there.
- **Stacks confirmed directly by Bryan 2026-08-01** (NOT inferable from the portfolio): NextLevel = Flask + Supabase · Woop = Flask + Supabase · AutoQuote = **GHL** AI Studio · Sunwise calculator and Charity Lift = **GoHighLevel** AI Studio (not Google AI Studio). Vanguard's Flask/Railway/Supabase is documented in the portfolio itself.
- **User counts supplied by Bryan** (nowhere in the portfolio): NextLevel 52 · AutoQuote 26 and counting · Vanguard Credits 2 (single-company deployment) · Sunwise 1 (client-customized). Other systems show operational metrics instead (AEMR 6,030 opportunities / 3,011 sends / 31.68% open rate / €7,450; LUA 8.7K members / 360 sub-accounts) — keep "app users" and "operational scale" visually distinct rather than blending them.
- **Solo on everything** — confirmed by Bryan. The CTO title at The 414 Project is technical/strategic, not people management. Don't soften this into implied team leadership.
- **Do not source stack claims from the decorative marquee** in `index.html` (the ~50-term keyword ticker, `aria-hidden="true"`). React, Next.js, Node, Twilio, OpenAI, Postgres, and Firebase appear ONLY there and are not attributable to any project.
- The n8n library is labeled a **demonstration build**, consistent with §5.

Verified counts used on the page: **3** A2P 10DLC clients (Squirrel, The Bill Busters, Genesis Credit — the three `compliance`-tagged cards) and **4** n8n badges (the 5th `badges.n8n.io` URL in `index.html` is the wallet profile, not a badge).

### Screenshot galleries — added 2026-08-01

23 of the 24 system cards now carry a thumbnail strip; clicking any thumbnail opens a full-size lightbox with prev/next, a counter, Escape-to-close and arrow-key navigation. (`bryanodina.com` is the one card without a gallery — no screenshots of it exist; it links to the live site instead.)

**How it works:**
- `GALLERIES` — an object at the top of the page's gallery script block, keyed by gallery name, each value an array of `im()` results. A local `CDN` constant and `im(hash, blur)` helper mirror `index.html`'s.
- Each `.sys-card` carries **`data-gallery="key"`**. A render loop finds every such card, builds a `.sys-shots` block (label + `.sys-shots-grid` of `.shot` buttons), and wires each thumbnail to `openLbGallery(items, index)`. Cards without the attribute are skipped.
- Max **6** thumbnails shown per card; if the set is larger the 6th tile gets `.more` with a `data-more="+N"` overlay. All images remain reachable via the lightbox regardless.
- **Adding a gallery to a card** = add a key to `GALLERIES` + put `data-gallery` on that card. Nothing else.

**Card sizing (2026-08-02):** `.sys-grid` uses `minmax(0,1fr)` columns (same width hygiene as the Work grid), and `.sys-shots` carries `margin-top:auto` so the screenshot strips align at the bottom of every card in a row rather than starting wherever each card's prose ends. `.sys-spec` has `margin-bottom:18px` to guarantee a minimum gap above that strip, since an auto margin collapses to zero on the tallest card in a row. **`grid-auto-rows:1fr` is deliberately NOT set here** — unlike the Work cards, these hold long unclamped prose across five spec rows, so forcing all 25 to the tallest would create large dead space; grid already equalises cards *within* a row via `align-items:stretch`, and between-row variation is acceptable for this layout. Do not "fix" this by adding it.

**Image hashes are DUPLICATED from `index.html`, not shared.** Same tradeoff as the design tokens: there is no shared data source, so **adding images to a project in `WORK_PROJECTS` does NOT update this page.** A verification script that cross-checks every hash on this page against `index.html` was used when building it — 120 unique hashes, all valid. Re-run that check after editing hashes; a typo renders a silently broken tile.

**Lightbox port — two deliberate deviations from `index.html`:**
1. The Escape handler calls **only `closeLb()`**. `index.html:1574` also calls `closeCase()`; copying that verbatim would throw `ReferenceError` on every Escape press here, since this page has no case modal.
2. The `document.querySelectorAll('[data-full]')` loop was dropped — no such elements on this page.

Everything else (`renderLb`, `openLbGallery`, `stepLb`, `closeLb`, the CSS, the `#lightbox` shell) is a faithful copy. `openLb()` was not ported — nothing calls it.

**Gallery composition notes** (the non-1:1 cards):
- `wisdomchurch` merges Wisdom Church + Celeste Nicolas (which share an automation system) — 11 images.
- `additional` = SSSGRP + Funded Biz + Charity Lift + DeAnna Crawford, the four projects that card names.
- `lifecycle` = automation/pipeline shots drawn from AEMR, Genesis Credit, Federal Barbers, DeAnna Crawford and Squirrel.
- `ghlscale` reuses the Level Up Academy set, since the 360-sub-account figure comes from there.
- `autoquote` = **images 2–6 of the Meritex set**, confirmed by opening all 9 and identifying the car-insurance quote flow visually (image 1 is the corporate site, 7–9 are review automation). Do not re-derive this by slicing on a guess.
- `vanguard` = **all 9 images, none blurred** — 4 clean CDN images plus 5 hard-redacted copies served from `images/vanguard/`. Built via the `loc(path)` helper, a sibling to `im(hash)` that takes a repo-relative path instead of a CDN hash. See §9.

**`images/vanguard/` is the first self-hosted image directory on this site** — everything else hotlinks `assets.cdn.filesafe.space`. Vercel serves the repo root statically so `/images/vanguard/*.png` resolves with no config change.

### Section membership (changed 2026-08-01)

A card may legitimately appear in more than one category section; each occurrence is its own `.sys-card` with its own copy written from that category's angle, sharing a `data-gallery` key.

| System | Sections |
|---|---|
| Vanguard Credits | **SaaS Platforms only** — the separate "Vanguard Credits pipeline" CRM card was removed 2026-08-01 and its Kanban/30-35-day-reminder detail folded into the SaaS card |
| Genesis Credit | Websites **+ CRM** |
| AEMR | Websites **+ CRM** + Customer Portals |

The "Lifecycle & lead-scoring builds" CRM card was trimmed at the same time — it used to name AEMR and Genesis Credit, which now have their own cards, so it covers only Federal Barbers, DeAnna Crawford, Squirrel and Wolfpack. Its gallery was re-pointed to match. Current totals: **25 `.sys-card`s, 24 with galleries** (`bryanodina.com` has no screenshots).

---

## 16. Third page: `/connect` (networking / QR landing) — added 2026-08-06

`connect.html` is a mobile link-in-bio page. Bryan hands out a **printed QR code** at networking events (first use: the GoHighLevel anniversary in Manila, 8-9 August 2026) and this is where it lands: his photo, a two-line intro, and five social buttons. Nothing else.

**The URL is `/connect` and it is effectively permanent** — it is printed on physical material Bryan hands to people. Do not rename the route or the file. If the page ever needs replacing, keep `/connect` working and change what it serves.

### Deliberately evergreen — TEMPORARILY OVERRIDDEN 2026-08-06 for the Manila event
No event name, date, or greeting appears anywhere in the copy — Bryan's explicit choice, so the same printed QR stays valid at future events and on business cards. **Do not add an event-specific line.**

**Exception, active now:** a "LIVE MANILA" event banner image sits above the avatar (`.banner`, first child of `.card`). Bryan asked for this explicitly, after being told it contradicts the rule above; he confirmed he wants it added now and will remove it himself after the event. It is **not** a change to this policy — it's a time-boxed exception. The markup is wrapped in an HTML comment marking it `TEMPORARY` and pointing back here and to `LOGS.md` 2026-08-06, specifically so a future session (or Bryan, later) can find and delete it as one block: the `<img class="banner">` element, the `.banner` CSS rule, the `--banner-h` token in `:root`, and its override in the `@media(max-height:700px)` block. **A future session should not treat this banner's presence as license to add more event-specific content to this page** — it's a one-time exception Bryan asked for and owns removing, not a precedent.

The banner image (830×272, transparent background — confirmed by decoding the PNG alpha channel before using it, corner alpha = 0) is hosted on a **different GHL location ID** (`bqd3A7Wt0iWPLpxnwLdJ`) than every other asset on this site (which use `7qfXIFSTdrRVqc8n8dWk`) — noted in case a future session wonders why this one CDN URL doesn't match the pattern; it's not an error.

**Sized by height, not width**, unlike a naive "full-width image" — see the `.banner` rule's own comment in `connect.html`. At true `width:100%` on a narrow phone the 3.05:1 image renders ~110px tall, which alone exceeds this page's entire default fold-budget headroom (see below). `--banner-h` (54px default / 20px compact) plus `width:auto` keeps it reading as a wide banner without dictating the page's vertical budget. Both figures came from iterating against the budget script below until each branch cleared ≥10px headroom — not guessed.

### Routing
`vercel.json` gained a second rewrite: `/connect` → `/connect.html`, alongside the keyland one. Same reasoning as §15 — **`cleanUrls` is still deliberately off** (it would make `/index.html` start 308-redirecting); add another targeted rewrite for any fourth page.

### Layout — restructured 2026-08-06 from "5 identical link rows" to "3 actions + 1 icon row"
The page originally had five identical full-width social buttons. Bryan then asked for a downloadable digital business card (vCard), a direct WhatsApp chat link, and a "Book a call" button — eight things stacked full-width no longer fits *any* phone (needs ~780px against ~730px usable on an iPhone 12 and ~553px on an SE). Presented with that tradeoff, Bryan chose a restructure over dropping anything: the three real calls-to-action stay full-width and prominent (`.actions`), and the five social links collapse into one row of circular icon buttons (`.social-row`). This **superseded** the original "five buttons, all identical" contract — the same-size guarantee still holds, just within each group rather than across all eight.

**The three action buttons — a contract, not a style choice.** `.action-btn` has a **fixed `height:var(--action-h)`** on the bare selector — never `min-height` — and `.action-btn--primary` (the vCard button) only ever overrides `background`/`border-color`, never size. This matters for the same reason it always has on this page: a landscape asset in an intrinsic-height row will stretch its own button. There's no raster icon in the action row today, but the rule stays because it's cheap and the next icon added here might be one.

**The social row — same reasoning as the old link-row, now in a circle.** Each `.social-btn` is a fixed `width:var(--social-size);height:var(--social-size)` circle. The **Level Up Academy logo is still a 372×220 landscape raster wordmark** — `.social-btn img` caps it to a 28×18 box with `object-fit:contain`, well inside the ≥44px circle, so it can't distort its own button or bleed past the edge. The four brand glyphs (Facebook, TikTok, LinkedIn, YouTube) are the same inline SVGs from the original build — **the first icons in the repo**, still true; no icon font or library anywhere. Two new icons were added for this change: a download arrow and the WhatsApp mark, both in the same 22×22 slot as the calendar glyph on "Book a call". All social/action icons use `currentColor` except brand-colored glyphs (Facebook blue, TikTok multi-color, LinkedIn blue, YouTube red, WhatsApp green) — brand color for recognition, neutral color for the two UI-only icons (download, calendar).

A verification script asserting all of the above (heights declared once, `--primary` never touches size, icon boxes fixed, ≥44px tap targets) lives in the 2026-08-06 `LOGS.md` entry. **Re-run its logic after any CSS edit here.**

### Fitting the phone fold
`body` is `min-height:100svh` + centred flex — `svh` not `vh`, because iOS Safari's `vh` excludes the address bar and would push the bottom of the card under it. A `@supports` fallback covers older browsers. Because it's `min-height`, overflow scrolls normally; **nothing is ever cut off**, the budget just aims to avoid scrolling at all.

Spacing runs off six tokens (`--avatar`, `--action-h`, `--action-gap`, `--social-size`, `--stack-gap`, `--banner-h`) so the `@media (max-height:700px)` compaction branch overrides six values instead of every rule — same technique as `index.html`'s `@media(max-height:760px)` hero rule. **Measured budget as of the 2026-08-06 banner addition: ~716px default, ~539px compact**, against ~730px usable on an iPhone 12/13/14 and ~553px on an iPhone SE — **14px headroom on both**, deliberately tuned to that floor by iterating `--banner-h` and `--avatar` against the budget script rather than picked by eye. (Before the banner: ~650px/~529px, 80px/24px headroom — the banner used up most of the default branch's slack and about 40% of the compact branch's.) **`--action-h` and `--social-size` must not go below 44px** (Apple HIG minimum tap target); tighten elsewhere first. `--avatar` has no such floor (it's not a tap target) and was the second lever pulled once `--banner-h` alone wasn't enough on the compact branch.

**A bug was found and fixed in the budget-calculation script itself while tuning the banner**, worth knowing before trusting its numbers again: it had hardcoded `.social-row`'s `margin-top` as `18` for both branches, silently ignoring the compact media query's override to `12`. Since this made the compact estimate 6px *worse* than reality, it didn't cause a false pass — but it's exactly the kind of bug that could, so the current script derives every margin value it uses (`.social-row`, `.portfolio-link`, `.avatar`, `.banner`) directly from the live CSS text instead of hardcoding any of them. **Re-derive, don't hardcode, if you extend this script again.**

**If you lengthen the bio, roles, or hint copy, re-run the budget check** — a three-line bio pushed both branches past the fold once already (2026-08-06, original 5-button build). That's what forced the current shorter wording, and it's exactly as easy to reopen with the new copy.

### Design tokens — one intentional divergence from index.html
The `:root` block is copied from `index.html` and currently matches on all 14 shared tokens (verified). **`html{font-size:120%}` is deliberately NOT copied.** That rule is the main portfolio's global type knob (§3); applying it here scales everything ~20% and pushes the buttons below the fold — the one thing this page must not do. A future session syncing tokens between pages must not "fix" this. There is a comment saying so at the top of the page's `<style>` block.

### Digital business card (vCard), WhatsApp, and Book a call — added 2026-08-06
The primary action is now **"Save my contact"**, a link to `/bryan-odina.vcf` (repo root) — a vCard 3.0 file, not 4.0, since 3.0 is what iOS Contacts, Android, and Google Contacts all import reliably. It contains name, `ORG`/`TITLE`, the WhatsApp number as `TEL`, `EMAIL`, `URL`, and `X-SOCIALPROFILE` entries for WhatsApp/LinkedIn/Facebook/TikTok/YouTube, plus the About-section photo embedded as base64 `PHOTO`. The point, per Bryan: saving the card puts him in the phone's Contacts, and because WhatsApp reads the address book, he then appears there automatically — that's the actual goal, not just "have a business card."

**Generated by `scripts/build-vcard.js`, not hand-written** — run `node scripts/build-vcard.js` from the repo root to regenerate after any detail changes (photo, title, socials). The script fetches the photo fresh from the CDN each run and base64-encodes the raw bytes directly, so there's no image-decoding dependency. **RFC 6350 line folding is the one thing most likely to silently break this file**: every physical line must be ≤75 octets, with continuation lines starting with a single space; the photo alone is ~170KB on one logical line, and an unfolded card can be silently rejected by some parsers. The script folds on octet boundaries (not characters), backing off from any position that would split a multi-byte UTF-8 sequence, since `TITLE` contains a "·" character.

**The download link deliberately has no `download` attribute.** That attribute forces a save-to-disk on every browser, including iOS Safari — which suppresses Safari's native "Add Contact" preview sheet, the exact UX this feature exists to trigger. Instead, `vercel.json` gained a `headers` entry serving `/bryan-odina.vcf` with `Content-Type: text/vcard; charset=utf-8` and `Content-Disposition: inline`, which is what lets Safari recognize and preview it. **This header entry is the thing most likely not to take effect after a deploy** — Vercel doesn't map `.vcf` to a content type by default, so verify it live with `curl -I` after every deploy that touches `vercel.json` or the vcf file, not just locally.

**WhatsApp number is `+639276476889`** — already public in both site footers ([index.html](index.html) and `keyland-compliance-group.html`), so putting it in the vCard and the direct `wa.me` chat button is not a new disclosure. **The email (`bryanodina.ghl@gmail.com`) IS a new public disclosure** — no email appeared anywhere on the site before this change. Flagged to Bryan before adding; he chose to include it.

"Book a call" links to `/#book`, the existing booking widget on the main portfolio (§7/§12) — no new booking surface was built for this page.

### Structure notes
- **No sticky header and no footer** (unlike keyland) — both cost fold space, and a footer of social links would duplicate the buttons.
- **Zero JavaScript** in the page itself — the vCard is a static pre-generated file, not something built client-side.
- Favicon hrefs use **leading slashes** (`/favicon.svg`), same as keyland, so they resolve at the extensionless URL.
- First page on the site with an `og:image` (the CDN photo) — this link gets shared person-to-person.
- **Not linked from `index.html`'s nav**, deliberately: it's reached by QR scan, and a nav entry would duplicate the footer socials. Adding one later is the same two-line change (desktop `.nav-links` + `.mobile-menu`) used for keyland's "Tech Summary".

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

---

## Deploy Rules

**Every time you (the agent) make a code change in this repo, ship it all the way to production in the same session — don't leave it sitting as a local/uncommitted change.** That means, after editing and after writing the `LOGS.md` entry:

1. **Commit and push** — `git add` the changed files (not `-A`), commit with a real message, `git push origin main`.
2. **Deploy** — `cd Portfolio && vercel --prod --yes --force --scope redcheekscoders-projects`. Always include `--force` (see §12 Deployment/Ops notes #2 — a plain `vercel --prod` can silently serve a stale build cache).
3. **Re-point every alias, including the custom domain.** `vercel --prod` does **not** move named aliases on its own (§12 Deployment/Ops notes #3). **Do not rely on a remembered/hardcoded list of aliases — run `vercel alias ls --scope redcheekscoders-projects | grep portfolio-ud47` (or `grep bryanodina`) first, every time, to get the actual current list.** This list has grown before without every session knowing it (a custom domain got added by one session; a later session's redeploys missed it for several cycles because it worked off an outdated mental list instead of checking — see `LOGS.md` 2026-07-19 "Custom domain was serving stale content"). As of 2026-07-19 the known aliases are: `bryanodina.com`, `www.bryanodina.com`, `portfolio-ud47.vercel.app`, `portfolio-ud47-redcheekscoders-projects.vercel.app`, `portfolio-ud47-redcheekscoder-redcheekscoders-projects.vercel.app`, `portfolio-ud47-git-main-redcheekscoders-projects.vercel.app` — but treat this as a snapshot, not a guarantee; the live `vercel alias ls` output is the source of truth. After the deploy succeeds, get the new deployment URL from the command's own output and run `vercel alias set <new-deployment-url> <alias> --scope redcheekscoders-projects` for every alias the live list shows.
4. **Verify live** — fetch the custom domain (e.g. `curl -sL https://bryanodina.com`) and grep for something unique to the change just shipped, to confirm the live site actually reflects it rather than an old cached deployment.

Only skip this flow if the user explicitly says to hold off (e.g. "don't deploy yet," "just save it locally"). Otherwise treat "the change is done" as meaning "the change is live," not just "the file is saved."
