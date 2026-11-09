# Redesign handoff notes

Branch `redesign-notes` = `redesign` (PR #26, open, not merged) + these notes + `REDESIGN-SPEC.md`.
Delete both files before merging if you don't want them in the published site.

## Preview locally

All links are root-absolute (`/about.html`), so serve the repo instead of opening files directly:

    python3 -m http.server 8000

Then open http://localhost:8000.

## State

- 7 pages + 404: `index.html`, `about.html`, `work.html`, `work/case-study.html`, `writing.html`, `writing/post.html`, `contact.html`, `404.html`.
- One stylesheet `assets/css/site.css` (core first, then one block per page), one script `assets/js/site.js`.
- Fonts: GothamPro + Gilroy woff2 in `assets/fonts/`, copied from vets-who-code-app.
- `partials/nav.html` and `partials/footer.html` are the source copies; they're pasted into every page by hand. Edit all pages if you change them.
- Checks passed: no overflow at 390/768/1024/1440; Lighthouse accessibility 100 on every page; every spec placeholder present verbatim.
- `CNAME` and `.github/workflows/static.yml` are untouched. Deploy runs only on push to `main`.

## Content still to fill

All copy is `[bracketed placeholders]` per the spec. Placeholders I added where the spec gave no text (e.g. `[Image]`, `[Lead paragraph.]`) are listed in PR #26.

- Background to work in: Jerome boxed before the Air Force. The ring-rope strip (`.ropes`) in the design nods to that. About story or Home hero are the natural places. Real specifics only.

## Deviations from the spec

- Home/About H1 sizes to its column (container query) because HARDAWAY. at 128px is wider than the hero column. Case-study H1 can drop below 52px on phones so ACCELERATOR. fits.
- Recognition eyebrow reads "Recognition" (spec had no text).
- Reading-progress label starts at "0% read"; the progress bar is hidden below 1024px.

## Open decisions

1. Gold focus ring is ~1.5:1 on cream/white (WCAG wants 3:1). Navy ring on light surfaces would fix it.
2. Card graphics keep their `aria-label`, so screen readers read it before each card title. `aria-hidden` on them would shorten that.
3. Font licensing: GothamPro and Gilroy are commercial and now downloadable from this public repo. Confirm the VWC license covers jerome.codes.
4. `README.md` still describes the old site.
