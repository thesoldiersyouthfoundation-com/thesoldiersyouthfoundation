# The Soldiers Youth Foundation website

Static site for https://thesoldiersyouthfoundation.com, hosted on GitHub Pages from `main`.

## Structure

- `index.html`, `about.html`, `programmes.html`, `partner.html`, `gallery.html`, `contact.html`, `404.html`
- `css/site.css` — all styles (Ceremonial theme); colours and fonts are variables at the top
- `js/site.js` — form submission, gallery filters, footer year
- `assets/img/` — logo, hero, chairman and gallery photos (keep each under about 300 KB)
- `scripts/check-release.sh` — run before every merge

## Editing

Header and footer are repeated in every page. When you change one, change all seven pages.

Forms post to a Google Sheet through an Apps Script web app (`apps-script/Code.gs`). Its URL goes in `js/config.js`; setup in `docs/google-sheets-setup.md`.

## Before merging into main

```
bash scripts/check-release.sh
```
