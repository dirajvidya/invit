# Victor & Diana — Animated Wedding Invitation

A mobile-first, single-page wedding invitation built with plain HTML, CSS, and
JavaScript — no frameworks, no build step. Just open `index.html` or deploy
with GitHub Pages.

## Features

- **Envelope intro** — a wax seal monogrammed "V & D"; tapping it opens the
  envelope with a folding-flap animation.
- **Parallax hero** — a softly blurred couple silhouette background with
  falling red & pink rose petals, names, and a short welcome line.
- **Scratch-off reveal** — a metallic scratch card guests uncover with a
  finger/mouse to reveal the date (13.11.2026), time (10:05 AM), and venue.
  A confetti burst fires once enough of the card is scratched away.
- **Smart toggles** — a "Get directions" switch opens the venue in Google
  Maps; an "Add to calendar" switch opens a pre-filled Google Calendar event.
- **Closing page** — a small November 2026 calendar with the 13th circled in
  a hand-drawn heart, a closing note from the couple, and a few small
  decorative photo medallions.

All illustrations (the background silhouette, seal, petals, heart, and small
photo icons) are original vector/generated art — no stock photography or
third-party images are used, so there's nothing to license.

## Customize it

Open `script.js` and edit the `EVENT` object at the top:

```js
const EVENT = {
  title: 'Wedding of Victor & Diana',
  dateStart: '20261113T100500',   // YYYYMMDDTHHMMSS
  dateEnd:   '20261113T130500',
  venueName: 'Grand Rose Garden Hall',
  venueAddress: '45 Blossom Avenue',
  mapsQuery: 'Grand Rose Garden Hall, 45 Blossom Avenue',
};
```

Then update the matching text in `index.html`:
- Names in `.hero-names` and `.signature`
- Date/time/venue inside `.scratch-reveal`
- The seal initials inside the inline SVG (`<text>V&amp;D</text>`)
- The calendar month/day markers in `script.js` (`NOV_2026_FIRST_WEEKDAY`,
  `DAYS_IN_NOV`, `MARKED_DAY`) if you change the month or date

> **Note:** the scratch card and the "mark the day" calendar are both set to
> **13 November 2026**, so the two sections agree. If you change the date,
> update it in three places: `EVENT.dateStart`/`EVENT.dateEnd` in
> `script.js`, the `.reveal-date` line in `index.html`, and — if the month
> changes — `NOV_2026_FIRST_WEEKDAY`, `DAYS_IN_NOV`, and `MARKED_DAY` in
> `script.js` plus the `cal-month` label in `index.html`.

## Project structure

```
├── index.html
├── style.css
├── script.js
└── images/
    └── hero-bg.jpg   (blurred couple-silhouette background)
```

## Deploy with GitHub Pages

1. Create a new repository and push these files to the root (or to `/docs`).
2. Go to **Settings → Pages**, set the source branch, and save.
3. Your invitation will be live at `https://<username>.github.io/<repo>/`.
