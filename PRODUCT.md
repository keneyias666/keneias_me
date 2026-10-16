# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Flask 3.0.3 + Jinja2 templates + Tailwind CSS (CDN) + vanilla JavaScript + Gunicorn, deployed on Render. Existing codebase — not a new build.

## Users

Three audiences, all served by the same surface — a generalist portfolio rather than a single-audience funnel.

- **Hiring managers / recruiters** evaluating the owner for an internship or junior developer / UI role. They need fast access to a resume, the work list, and a way to make contact.
- **Peer developers** skimming projects, judging craft, and possibly forking or contributing. They read the code-adjacent writing and click through to GitHub.
- **Potential clients** considering the owner for graphic, branding, or web work. They linger in the Artworks section and reach out via chat or contact form.

The site must serve all three without picking one. Primary user situation: a 30–90 second scan followed by a single, decisive action (download resume, open a project, send a message, or start a chat).

## Product Purpose

A single-page editorial portfolio that presents Kenette Elias "Amaba C." — a 4th-year BSIT student at the University of Cebu — as a developer with a real design sensibility. The portfolio exists to make the owner legible to recruiters, peers, and clients in one visit, and to convert that legibility into a concrete next step (download resume, open a project, send a message, or start a chat).

Success looks like: a visitor leaves with a clear sense of who the owner is, what they've built, and a frictionless path to follow up.

## Positioning

Editorial-style personal portfolio with an integrated Flowise AI chatbot. Distinct because the surface is *not* a generic developer template — it is type-led (Cormorant Garamond + DM Sans + JetBrains Mono), deliberately minimal, and treats the visual craft (typography, posters, illustration) as a first-class capability alongside the engineering work. A neighbouring template-driven portfolio could not truthfully claim this combination of code + art.

The chatbot is both a useful Q&A surface about the owner *and* a piece of the site's personality — useful answers, presented with character.

## Operating Context

- Single static-feeling page served by Flask; one route renders `index.html` with the `works` list injected from `app.py`.
- A `/api/chat` endpoint proxies user questions to a Flowise cloud chatflow (chatflow ID `0256b6d0-12c4-4eb9-950a-75dc59f549a1`); the API key stays server-side.
- Two visual modes (light / dark) with cross-faded profile imagery, custom cursor, film grain, and a leaf-burst transition.
- Visitors arrive from GitHub, Behance, and direct share. The site is short — under 1,500 lines of HTML plus ~3,300 lines of CSS — and is meant to be skimmed, not read.
- Deployed on Render via `render.yaml`; `gunicorn app:app` is the production entry. Local dev uses `python app.py` on port 5000.

## Capabilities and Constraints

**Capabilities**

- Hero, About, Skills (tabbed: Web / Design / Database / Systems / Tools / Soft), Hobbies, Works, Artworks, and Contact sections on one page.
- Theme toggle with localStorage persistence and system-preference fallback; matched cross-fade between profile images.
- Flowise-backed chatbot with retry across two payload shapes and graceful degradation if Flowise is down.
- Responsive layout via Tailwind breakpoints; mobile menu drawer; scroll-reveal animations.
- Resume (PDF + PNG) downloadable from the static folder.

**Confirmed technical constraints**

- Flask 3.0.3, Python 3, Gunicorn 22.0.0 — already pinned in `requirements.txt`.
- Tailwind is loaded via CDN (not built); custom CSS lives in `portfolio/static/css/style.css` (~3,300 lines) with CSS variables for theming.
- `FLOWISE_API_URL` and optional `FLOWISE_API_KEY` are read from environment; defaults are baked into `app.py` for the bundled chatflow.
- `render.yaml` and `Procfile` are committed; deployment is `cd portfolio && gunicorn app:app`.

**Explicitly undecided / not in scope here**

- Visual world decisions, palettes, typography choices, motion choices — these belong in `new-work`, not `PRODUCT.md`.
- Whether the existing `style.css` should be kept as the source of truth or replaced with a tokenised system.
- Whether to move off Tailwind CDN to a built pipeline.
- Whether to add a real backend (DB) for project filtering, contact form submission, etc.

## Brand Commitments

- **Name / mark:** "KEA." wordmark with a K-shaped logo mark; the wordmark uses Cormorant Garamond with a dimmed period as a recurring device.
- **Voice:** "Developer by degree. Artist by passion with a hint of obsession." The writing is first-person, slightly literary, calm, and confident — not corporate, not jokey.
- **Pinned line:** "Progress, not perfection" — surfaced in the About section as a guiding belief.
- **Typography pairing (binding):** Cormorant Garamond (editorial display, light + italic) · DM Sans (body) · JetBrains Mono (eyebrow / accent). Already configured in the Tailwind config and loaded from Google Fonts.
- **Visual commitments already in the surface:** dark/light theming, film grain overlay, cross-faded profile imagery, scroll-reveal, intentional whitespace, monospace eyebrows with `[0.2em]`–`[0.3em]` tracking.
- **No mock content rule:** phone, address, project descriptions, GitHub handle, and Behance URL are real per the owner; future work must not invent testimonials, clients, press, or stats.

## Evidence on Hand

Real content already in the repository that future work may reference but must not fabricate beyond:

- **Works list (6 entries)** in `portfolio/app.py` — VoiceVerSign (capstone, 2025), Cohhee (2024), TESQUA Event Organizer (2024), a SQLite CRUD app (2023), an Ink & Intent artworks collection (2022–), and a Love Proposal Web App (2025). Each has a title, description, tags, year, and a link to GitHub, Behance, or live web app.
- **Profile imagery:** `profilelight.png` / `profiledark.png` (and matching SVGs) for hero; `logo.png` + `logo svg.png` for the brand mark.
- **Resume assets:** `elias_resume_pdf.pdf` and `elias_resume_jpg.jpg` in `static/images/`.
- **Artwork and hobby imagery:** `csgo_logo.jpg`, `dota_logo.jpg`, `stardew_logo.png`, `jcole_album.jpg`, `neckdeep_album.jpg`, `NF_album.jpg`, `manfrommoscow_book.jpg`, `nolongerhuman_book.jpg`, `searchformeaning_book.jpg` (under `static/images/`).
- **Contact facts:** phone `+63 915 843 0692`, address `Sinai Mohon 2 Tisa Cebu City, Philippines`, GitHub `keneyias666`, Behance `eliasamaba1`, availability "Open to Opportunities".
- **Education timeline (real, in markup):** Tisa 2 Elementary (2009–2015), Don Carlos A. Gothon Memorial NHS (JHS 2015–2019, SHS STEM 2019–2021), University of Cebu Main — BSIT (2021–present).
- **Experience timeline (real, in markup):** Barangay Tisa Encoder (2020–2021); EPERFORMAX / T-Mobile Customer Service Rep (2023–2024).

**Absences future work must not fabricate:** testimonials, named clients, press mentions, view counts, download counts, awards, conference talks, or pricing/availability claims beyond what the owner has stated.

## Product Principles

1. **Code and craft are the same craft.** Engineering decisions and typographic decisions belong to the same eye. The portfolio reflects this by treating visual details (keming, tracking, weight, rhythm) with the same care as architecture.
2. **Editorial calm over template noise.** Whitespace, hierarchy, and restraint carry the page. Add only what earns its place; remove what doesn't.
3. **Every section earns the next click.** Hero → Works → Contact is the spine. Everything else exists to make that spine credible, not to compete with it.
4. **Personality, never performance.** The chatbot is a useful, on-brand companion — not a gimmick. The voice stays calm, slightly literary, and direct.
5. **Honest inventory.** Show real projects, real skills, real timelines. No invented metrics, no borrowed authority.

## Accessibility & Inclusion

No formal accessibility standard was confirmed. The current surface uses semantic HTML, labelled controls, alt text on imagery, keyboard-reachable interactive elements, and a prefers-reduced-motion respect path; future refinements should preserve and improve these without overstating a formal commitment.
