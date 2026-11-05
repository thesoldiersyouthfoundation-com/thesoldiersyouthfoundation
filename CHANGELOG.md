# Changelog

## v2.3.0 — Simpler inner pages

- About, Programmes, Partner and Eligibility pages no longer open with a banner and description; like Gallery and Contact they start with the page title and content
- Programmes: batch timings line moved into the "Apply for the next batch" section
- Founder's name updated to Lt Col (DR) S. Srinivasa Rao across the site

## v2.2.0 — Eligibility checker

- New page eligibility.html: candidates enter their details (name, phone, email, date of birth, town, gender, marital status — all required), qualification, NCC certificate and work status, and see which of 27 Army, Navy and Air Force entries (NDA, TES, CDS, AFCAT, TGC, SSC Tech, NCC Army and Air Force, JAG, Navy SSC, Territorial Army, Agniveer) they can apply for now, later, or not, with reasons and mark cut-offs to keep in mind
- Every check is saved to the Google Sheet (Eligibility tab) with the candidate's details and results
- After the results, candidates can book a free counselling call (date, time, language); bookings go to the Google Sheet with their eligibility summary
- Entry rules live in js/eligibility-data.js (checked November 2026); edit that file when a notification changes
- "Eligibility" added to the main menu and footer; "Check your eligibility" button in the home hero
- apps-script/Code.gs: new Eligibility and Counselling tabs (redeploy the script to use them; until then both land in the Contact tab)

## v2.1.0 — Layout and motion

- Larger text across the site (body 18px to 20px, headings and menus scaled to match)
- Three-column layout on wide screens: founder card fixed in the left pane, "Projects completed" cards in the right pane; both stack above and below the content on tablets and phones
- Dropdown menus on every main menu item, linking to page sections and gallery filters (gallery.html#training, #video, #news, #republic-day, #rally)
- Animations: header and hero entrance, slow zoom on the hero photo, scroll-in reveals for sections and cards, card lift and image zoom on hover, button light sweep, moving medal ribbons, back-to-top button. All motion is switched off for visitors who set "reduce motion"
- Home page leadership section removed (the founder card now shows on every page)
- To edit the founder card or the projects list, change the same block in each page (inside `<aside class="pane ...">`)

## v2.0.0 — Redesign (unreleased)

See RELEASE.md for the full list and the pre-launch checklist.

- Six-page site in the Ceremonial design (olive, brass, parchment; Cinzel and Source Serif 4)
- Registration details, official email and address
- Working forms saved to Google Sheets, with email alerts
- No emojis, no placeholder text, three programmes instead of six
- Gallery of 6 compressed photos and 1 video
- Release check script and GitHub Action

## v1.0.0 — Original single-page site

Tag the current `main` commit as `v1.0.0` before merging v2.0.0.
