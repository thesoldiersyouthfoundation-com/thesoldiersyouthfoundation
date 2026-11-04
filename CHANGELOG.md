# Changelog

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
