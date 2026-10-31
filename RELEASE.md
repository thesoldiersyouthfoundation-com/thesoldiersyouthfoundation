# Release v2.0.0 — Site redesign

Branch: `redesign` → merge into `main` (GitHub Pages deploys from `main`).

## What changes

- One long page becomes six pages: Home, About, Programmes, Partner with us, Gallery, Contact. A 404 page is added.
- Ceremonial design: olive `#2E3A23`, brass `#C9A35A`, parchment `#F5F0E4`, maroon `#6B1E23`; Cinzel headings, Source Serif 4 body text; centred crest header and medal-ribbon dividers.
- Credentials strip under the hero: Registration No. 94 of 2021, Telangana Societies Registration Act, 2001.
- Registration and transparency section on About, with legal status, registrar and registered address.
- Official email `contact@thesoldiersyouthfoundation.com` and registered address on every page.
- Support section and a Partner page with CSR and individual options, replacing the "Donate / Partner" link that only scrolled to the form.
- Three forms (contact, training application, partnership enquiry) wired for Formspree, with consent checkboxes and a spam honeypot. They show a "not connected" message until the form ID is added.
- Six programme cards merged into three: Defence recruitment preparation, Youth skill development, Mentorship.
- Removed: all emojis, placeholder text, "TBD" events, the empty Impact numbers, "Tracks we support", the hero tick list and the footer hosting note.
- Gallery trimmed to 6 photos and 1 video, with filters. Photos renamed and compressed: 34 MB of assets down to about 1.4 MB.
- SEO: per-page titles and descriptions, Open Graph image, canonical URLs, NGO structured data, `sitemap.xml`, `robots.txt`, favicon.
- `scripts/check-release.sh` and a GitHub Action block merging while any `[TODO`, unconnected form, emoji or broken local link remains.

## Must be done before merging

The release check fails until these are done.

- [x] Chairman's full name: Lieutenant Colonel (Dr) S. Srinivas Rao
- [x] Formspree forms: Contact `xljjjwpk`, Partnership `xqpppdyj`, Training application `mnpppbgg` (all email thesoldiersyouthfoundation@gmail.com)
- [x] Public email: thesoldiersyouthfoundation@gmail.com until contact@thesoldiersyouthfoundation.com receives mail
- [ ] Confirm PIN 500011 and that the registered address is the right public address
- [ ] Submit each form once on the live preview and confirm the email arrives

Run `bash scripts/check-release.sh` locally. It must print "Release check passed."

## Add when the foundation sends them

Each of these was removed rather than shown as a placeholder. Add them back when real data exists.

- Trustee names and one-line roles: `about.html`, after the chairman (marked with a comment).
- Switch the public email to contact@thesoldiersyouthfoundation.com once it receives mail (all pages and the structured data in `index.html`).

- 12A, 80G, CSR-1, NGO Darpan ID: add to the credentials strip (`index.html`) and the table on `about.html#transparency`. List only what they hold.
- Registration certificate and audited accounts PDFs: put in `assets/docs/` and link from `about.html#transparency`.
- Impact figures with "as of" month: Home, after "What we do".
- Bank and UPI details: Home "For individuals" and Partner "Donate as an individual".
- 80G receipt note (only if approved): Partner "What you receive" and the donate panels.
- Next batch date, duration, timings, fee, location: the strip under the Programmes hero.
- Funding package amounts: Partner "Ways to fund".
- Office hours: Contact page.

## Google Sheets (optional, recommended)

- Forms also post to a Google Sheet, which emails an alert per submission; the home page Impact section reads its figures from the sheet's Stats tab.
- Set up per `docs/google-sheets-setup.md`, then paste the web app URL into `js/config.js`.
- With `sheetsUrl` empty, Sheets is off: forms still go to Formspree and the Impact section stays hidden.

## Deploy steps

1. In VS Code: `git fetch` the branch (see below), check it out and open the pages with Live Server.
2. Fill the must-do items, run the release check, commit.
3. Push `redesign` and open a pull request into `main`. The Release check action must pass.
4. Merge. GitHub Pages republishes in a minute or two. `CNAME` is unchanged.
5. Old links such as `/#contact` still land on the home page.
6. In Google Search Console, submit `https://thesoldiersyouthfoundation.com/sitemap.xml`.

## Rollback

Revert the merge commit on `main`, or redeploy tag `v1.0.0` (the current site).
