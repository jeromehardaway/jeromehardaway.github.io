# jerome.codes — Redesign Build Spec

**Bottom line:** Replace the current single-page site in this repo with a 7-page static site. Plain HTML/CSS/JS, no build step, deployed on GitHub Pages. Design is final; copy is placeholder. Keep every `[bracketed placeholder]` exactly as written — Jerome fills content later.

---

## 1. Ground rules

1. **Stack:** static HTML + one shared CSS file + one small JS file. No framework, no bundler, no npm.
2. **Hosting:** GitHub Pages. **Do not touch `CNAME`** (`jerome.codes`).
3. **Remove** the old site: current `index.html` content, `styles.css`, `skills.css`, `script.js`, Font Awesome, the dark-mode toggle, Outfit/JetBrains Mono fonts.
4. **No Japanese** text, kanji, ink-brush or seal graphics anywhere.
5. **No emoji.** Icons are inline stroke SVGs (2px stroke, square caps).
6. **Placeholders:** keep `[Like this]` text verbatim. Do not invent copy, stats, dates, or names.
7. Work on a branch `redesign`, not `main`.

## 2. File structure

```
/
├── CNAME                  (unchanged)
├── index.html             Home
├── about.html             About
├── work.html              Work index
├── work/case-study.html   Case study template
├── writing.html           Writing index
├── writing/post.html      Article template
├── contact.html           Contact
├── 404.html               Simple: nav, "Page not found", link home, footer
├── assets/
│   ├── css/site.css
│   ├── js/site.js
│   ├── fonts/             GothamPro + Gilroy woff2 (see §3.3)
│   └── img/               (empty for now; placeholders are CSS)
└── partials/              (optional reference copies of nav/footer)
```

Nav and footer are repeated in every page (static site). Keep the markup identical across pages; only the `aria-current="page"` link changes.

## 3. Design tokens

Put these on `:root` in `site.css`.

### 3.1 Color

| Token | Hex | Use |
|---|---|---|
| `--navy` | `#091f40` | Primary, headings, dark sections |
| `--red` | `#c5203e` | Accent, CTAs, markers |
| `--red-hover` | `#A51C30` | Button hover |
| `--gold` | `#FDB330` | Focus ring, small highlights on navy |
| `--cream` | `#EEEDE9` | Page background |
| `--off-white` | `#F8F9FA` | Alternate light section |
| `--white` | `#FFFFFF` | Cards |
| `--ink` | `#1A1823` | Body text (strong) |
| `--text-2` | `#343A40` | Body text |
| `--text-3` | `#495057` | Meta / mono labels (passes AA on cream) |
| `--silver` | `#DEE2E6` | Borders on light |
| `--sky` | `#B9D6F2` | Meta text on navy |
| `--on-navy` | `#DEE2E6` | Body text on navy |
| `--border-navy` | `rgba(185,214,242,0.2)` | Borders on navy |

Rule: 60% cream/neutrals, 30% navy, 10% red. Gold only for focus rings and tiny highlights.

### 3.2 Type

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / H1 | GothamPro | 900 | UPPERCASE, `letter-spacing: -0.04em`, `line-height: 0.88–0.92` |
| H2 | GothamPro | 900 | UPPERCASE, `-0.03em`, `line-height: 0.95` |
| H3 / labels | GothamPro | 700–900 | UPPERCASE |
| Buttons | GothamPro | 700 | 12px, UPPERCASE, `letter-spacing: 0.08em` |
| Body | Gilroy | 400 | 16–18px, `line-height: 1.7–1.8` |
| Lede | Gilroy | 400 | 19–22px, `line-height: 1.55` |
| Meta / eyebrow | `ui-monospace, SFMono-Regular, Menlo, monospace` | 500 | 11–12px, UPPERCASE, `letter-spacing: 0.1em` |
| Quotes | GothamPro | 300 | 28–46px |

Fluid sizes:
- H1: `clamp(52px, 7.6vw, 116px)` (Home hero up to 128px)
- H2: `clamp(36px, 4.6vw, 60px)`

### 3.3 Fonts

Self-host from the Vets Who Code production repo (`Vets-Who-Code/vets-who-code-app`, under `public/` or `src/assets/fonts/`). Copy these woff2 files into `assets/fonts/`:

- GothamPro: Light (300), Regular (400), Medium (500), Bold (700), Black (900)
- Gilroy: Light, Regular, Medium, Semibold, Bold, Extrabold, Black

Declare each with `@font-face` + `font-display: swap`. If the files can't be found, stop and tell Jerome — do not substitute.

### 3.4 Space, shape, motion

- 8px grid. Container `max-width: 1230px`, side padding `24px`.
- Section padding: `112–120px` vertical on desktop, `72px` on mobile.
- **Border radius: 0 everywhere.** Only exception: focus ring radius 4px.
- Shadows: card hover `0 10px 30px rgba(0,0,0,.14)`; hero image `0 20px 50px rgba(0,0,0,.2)`.
- Motion: 300ms ease-out. Buttons hover `translateY(-1px)`, press `scale(.95)`. Cards hover `translateY(-2px)` + 2px red top border appears.
- `@media (prefers-reduced-motion: reduce)` → disable all transitions.
- Focus: `outline: 3px solid var(--gold); outline-offset: 2px; border-radius: 4px` on every interactive element.

## 4. Signature elements (reuse everywhere)

1. **Eyebrow:** 16×2px red bar + mono uppercase label, 12px gap.
2. **Compass tick ruler** (Air Force): full-width strip under nav and under Home hero.
   ```css
   .ticks{height:10px;opacity:.45;background-image:
     repeating-linear-gradient(90deg,var(--navy) 0 1px,transparent 1px 12px),
     repeating-linear-gradient(90deg,var(--navy) 0 2px,transparent 2px 120px);
     background-size:100% 4px,100% 10px;background-repeat:no-repeat;background-position:0 100%,0 100%}
   ```
   Home version adds mono labels below: `000 090 180 270 360`, space-between.
3. **Ring ropes** (boxing): three 3px lines, 6px gap — red / cream / red. Top of footer and top of Home "principles" band.
4. **HUD corner brackets:** 22×22px, 2px red L-shapes in the corners of instrument panels and photo frames.
5. **Outlined numerals** (round cards): GothamPro 900, `color: transparent; -webkit-text-stroke: 2px <color>`. Sky on navy, red on cream.
6. **Image placeholder:** `background: #DEE2E6` + `repeating-linear-gradient(135deg, rgba(9,31,64,.06) 0 12px, transparent 12px 24px)`, centered mono label like `[Cover image]`.
7. **Monogram:** "JH" in GothamPro 900 on a navy square with a 4px red bottom border (inverted cream/navy in footer).
8. Headline period: H1s end with a red `.` span (e.g. `The work<span class="red">.</span>`).

## 5. Graphics (inline SVG, `viewBox="0 0 600 450"`)

Four variants. `--ink` = navy on light, cream (`#EEEDE9`) on navy. Red is always `#c5203e`. Each SVG gets `role="img"` and an `aria-label`.

**Radar** (`aria-label="Radar scope with a red sweep and contact"`)
```html
<g fill="none" stroke="INK">
  <circle cx="300" cy="225" r="200" stroke-width="10" stroke-dasharray="1.5 8.97" opacity=".55"/>
  <circle cx="300" cy="225" r="180" stroke-width="2"/>
  <circle cx="300" cy="225" r="120" stroke-width="1" opacity=".5"/>
  <circle cx="300" cy="225" r="60" stroke-width="1" opacity=".5"/>
  <line x1="100" y1="225" x2="500" y2="225" opacity=".4"/>
  <line x1="300" y1="25" x2="300" y2="425" opacity=".4"/>
</g>
<path d="M300 225 L300 45 A180 180 0 0 1 427.3 97.7Z" fill="#c5203e" opacity=".16"/>
<line x1="300" y1="225" x2="427.3" y2="97.7" stroke="#c5203e" stroke-width="3"/>
<circle cx="380" cy="130" r="8" fill="#c5203e"/>
<circle cx="225" cy="300" r="5" fill="INK" opacity=".7"/>
<circle cx="340" cy="320" r="5" fill="INK" opacity=".7"/>
<!-- N/E/S/W mono labels, 13px: (300,18) (514,230) (300,446) (78,230) -->
```
Optional: slowly rotate the sweep (8s linear infinite), disabled under reduced motion.

**Chevrons**
```html
<g fill="none" stroke-linecap="square" stroke-width="30">
  <path d="M150 170 L300 80 L450 170" stroke="INK"/>
  <path d="M150 250 L300 160 L450 250" stroke="INK"/>
  <path d="M150 330 L300 240 L450 330" stroke="#c5203e"/>
</g>
<line x1="120" y1="400" x2="480" y2="400" stroke="INK" stroke-width="2" opacity=".4"/>
```

**Bars**
```html
<g fill="INK">
  <rect x="96" y="300" width="36" height="80"/><rect x="156" y="250" width="36" height="130" opacity=".85"/>
  <rect x="216" y="270" width="36" height="110" opacity=".85"/><rect x="276" y="200" width="36" height="180"/>
  <rect x="336" y="220" width="36" height="160" opacity=".85"/><rect x="396" y="150" width="36" height="230"/>
  <rect x="456" y="120" width="36" height="260" fill="#c5203e"/>
</g>
<line x1="80" y1="380" x2="520" y2="380" stroke="INK" stroke-width="2"/>
<polyline points="114,280 174,232 234,250 294,180 354,200 414,128 474,96" fill="none" stroke="#c5203e" stroke-width="3"/>
<circle cx="474" cy="96" r="8" fill="#c5203e"/>
<!-- dashed gridlines at y=140,220,300, stroke INK, opacity .2, dasharray "2 8" -->
```

**Ropes**
```html
<rect x="70" y="80" width="34" height="320" fill="INK"/><rect x="64" y="70" width="46" height="20" fill="INK"/>
<g fill="none" stroke-width="12" stroke-linecap="square">
  <path d="M104 140 Q330 168 560 150" stroke="#c5203e"/>
  <path d="M104 220 Q330 250 560 230" stroke="INK"/>
  <path d="M104 300 Q330 332 560 310" stroke="#c5203e"/>
</g>
<g fill="INK"><rect x="98" y="128" width="16" height="24"/><rect x="98" y="208" width="16" height="24"/><rect x="98" y="288" width="16" height="24"/></g>
<line x1="40" y1="400" x2="580" y2="400" stroke="INK" stroke-width="2" opacity=".4"/>
```

## 6. Shared components

### Nav (every page)
- Cream background. Row: left = monogram + stacked "JEROME HARDAWAY" (GothamPro 900, 16px) / "Founder · Vets Who Code" (mono 11px, `--text-3`). Right = links **Home, About, Work, Writing** (mono 12px uppercase, 28px gap) + red **Let's talk** button → `contact.html`.
- Active link: red text + 2px red bottom border, `aria-current="page"`.
- Below the row: tick ruler.
- Mobile (<760px): links wrap below; no hamburger needed.

### Footer (every page)
- Navy. Ring ropes at the top edge.
- 4 columns (auto-fit, min 200px): (1) cream monogram 72px + `[Short sign-off line]`; (2) **Site**: Home, About, Work, Writing, Contact; (3) **Vets Who Code**: vetswhocode.io, GitHub org (`github.com/Vets-Who-Code`); (4) **Elsewhere**: LinkedIn (`linkedin.com/in/jeromehardaway`), GitHub (`github.com/jeromehardaway`).
- Column labels mono sky; links 15px off-white, hover white + underline.
- Bottom bar: `© 2026 Jerome Hardaway · jerome.codes` / `Aim high` (mono 11px sky). Use the current year from JS.

### Buttons
- **Primary:** red bg, white text, 48px min height, `14px 28px` padding. Hover `--red-hover`.
- **Outline:** 2px navy border, navy text (cream border/white text on navy).
- **Text link:** mono 12px uppercase, 2px red bottom border, e.g. `All work →`.

### Cards
- White, 1px silver border, 2px top border (silver at rest → red on hover), 0 radius.

## 7. Pages

### 7.1 Home — `index.html`
1. **Hero** (2 columns, auto-fit min 460px): left = eyebrow "Founder · Vets Who Code", H1 `Jerome<br>Hardaway.` (red period), lede `[Intro — one or two sentences on who you are and what you build at Vets Who Code.]`, buttons **See the work** (primary → work.html) + **About me** (outline → about.html). Right = **instrument panel**: navy box, corner brackets, Radar graphic in cream, caption row mono sky: `Atlanta, GA · Est. 2014 · ● Online` (Online in gold).
2. **Tick ruler with heading labels.**
3. **Proof strip:** 3 columns, 2px navy top border, vertical silver dividers. Big numbers 72px GothamPro 900: `$20M+` (red), `2014` (navy), `[00]` (navy); each with mono `[Stat label]`.
4. **Selected work** (off-white band): eyebrow "Selected work", H2 `[Section headline]`, text link `All work →`. Grid: one large navy card spanning 2 rows (Bars graphic in cream, "Case study 01 / [Year]", title **Vets Who Code accelerator**, `[One-line summary of the project.]`, gold `Read the case study →`) + two white cards side-by-side with a 160px graphic on the right (**The Hashflag Method** + Chevrons; **J0dI3** + Radar). All link to the case study.
5. **Principles** (navy band, ropes on top): eyebrow `[Eyebrow]`, H2 `[Section headline]`, 3 columns split by navy borders. Each: outlined numeral (01/02/03), 40px red icon, H3, `[What it taught you, in a sentence or two.]`.
   - 01 **Air Force** — icon: three stacked chevrons
   - 02 **Boxing** — icon: post + three curved ropes
   - 03 **Data & AI** — icon: bar chart
6. **Writing teaser:** eyebrow "Writing", H2 `[Section headline]`, `All writing →`. 2px navy top border, 3 rows: `[MMM DD, YYYY]` | `[Post title]` (GothamPro 700 22px) | `[Topic]` | red `→`. Row hover = white background. Links → post.
7. **CTA band** (red): H2 `[Call to action headline]`, `[One supporting line.]`, navy button **Get in touch** → contact. Right: Ropes graphic in white.
8. Footer.

### 7.2 About — `about.html`
1. **Hero** (2 columns): left = portrait placeholder 4:5 `[Portrait photo]` with red 3px corner brackets (top-left, bottom-right), caption row `[Photo caption]` / `Atlanta, GA`. Right = eyebrow "About", H1 `[Headline about you]`, lede `[Two or three sentences that introduce you in your own voice.]`, then **Service record** card (navy `<dl>`, 2×2 grid): header row "Service record / JH" in gold mono; Branch: U.S. Air Force · Specialty: Security Forces · Founded: Vets Who Code, 2014 · Based: Atlanta, GA.
2. **Story** (off-white): left col eyebrow "The story" + H2 `[Section headline]`; right (span 2, max 720px) 4 paragraphs: `[Opening paragraph — where your story starts.]` (19px, with a red 72px drop-cap placeholder `[A]`), `[Paragraph — the turn: teaching yourself to code.]`, `[Paragraph — why you started Vets Who Code.]`, `[Paragraph — what you're building now.]`.
3. **Flight path timeline:** eyebrow "Flight path", H2 `[Section headline]`. Horizontal `<ol>` on a 2px navy line; 5 items each with a 16px square marker sitting on the line (navy; last one red), `[Year]`, `[Milestone]`, `[One line of context.]`. Stacks vertically on mobile.
4. **Quote band** (navy): 6px red vertical bar + `<blockquote>` `[A line you live by.]` (GothamPro 300) + `— Jerome Hardaway`.
5. **Recognition:** eyebrow, H2 `[Section headline]`, red button **Book me to speak** → contact. 6-tile grid with 1px silver gutters, each tile: red chevron icon, `[Recognition]`, `[Org · Year]`.
6. Footer.

### 7.3 Work index — `work.html`
1. **Header** (2 columns): eyebrow "Work · Vets Who Code", H1 `The<br>work.`; right = `[Short intro to the body of work.]` + two mini stats: project count (computed) "Projects", `2014` "Since".
2. **Filter bar:** 2px navy top border, chip buttons `All · Accelerator · Curriculum · AI · Open source`. Real `<button aria-pressed>`; active = navy fill/white text. JS filters cards by `data-cat`.
3. **Grid** (auto-fit min 380px). Card = graphic panel on top (navy or off-white, alternating) + body: `01 · Category` / `[Year]`, title, `[One-line summary.]`, red `Read the case study →`.

| # | Title | Category | Graphic | Panel |
|---|---|---|---|---|
| 01 | Vets Who Code accelerator | Accelerator | Bars | Navy |
| 02 | The Hashflag Method | Curriculum | Chevrons | Light |
| 03 | J0dI3 | AI | Radar | Navy |
| 04 | hashflag-skills | Open source | Ropes | Light |
| 05 | Software Factory | Accelerator | Chevrons | Navy |
| 06 | Prework | Curriculum | Bars | Light |

All link to `work/case-study.html` for now.

### 7.4 Case study — `work/case-study.html`
1. **Hero** (navy): `← All work` mono link, eyebrow "Case study 01 · Accelerator", H1 **Vets Who Code accelerator** (max 1000px), lede `[One-sentence summary of the project and why it matters.]`. Meta `<dl>` 4 columns with navy dividers, gold labels: Role `[Your role]` · Timeline `[Start — End]` · Team `[Team size]` · Stack `[Tools]`.
2. **Hero image** `[Hero image or product screenshot]`, 16:7, overlaps the navy section by 80px (translateY), big shadow.
3. **Chapters** ×3, each: 2px navy top border; left = red outlined numeral + H2 (**The problem / The approach / The outcome**); right (span 2) = `[Lead sentence for this section.]` (20px) + `[Supporting paragraph.]`.
4. **Process:** eyebrow "How it came together". 4 step boxes (last one navy): `Step 01` + red arrow icon, `[Step name]`, `[What happened in this step.]`. Then two 4:3 image placeholders + caption `Fig. 01 — [Caption]`.
5. **Results** (red band): mono "Results", 2px white top border, 3 stats `[00]` (80px) + `[Metric label]`.
6. **Testimonial:** red vertical bar, quote `[Quote from a troop, partner, or teammate.]`, 48px avatar placeholder, `[Name]`, `[Role · Cohort]`.
7. **Next case study** (full-width navy link): "Next case study" / **The Hashflag Method** + big red `→` that slides 8px right on hover.
8. Footer.

### 7.5 Writing index — `writing.html`
1. **Header:** eyebrow "Writing", H1 `Field<br>notes.`, right-aligned `[Short line on what you write about.]`.
2. **Featured post** (2 columns between 2px navy top / silver bottom rules): 4:3 `[Cover image]`; right = red "Featured" tag + `[MMM DD, YYYY]` + `[0] min read`, H2 `[Featured post title]` (turns red on hover), `[Two-line excerpt of the post.]`, `Read the post →`.
3. **Latest:** H2 "Latest" + topic chips (`All` active, then `[Topic]` ×3). 6 cards (auto-fit min 320px): `No. 002`… + `[Topic]`, `[Post title]`, `[One-line excerpt.]`, footer row `[MMM DD, YYYY]` / `[0] min`. Outline button **Load more**.
4. **Newsletter** (navy): eyebrow "Newsletter", H2 `[Newsletter headline]`, `[What subscribers get, and how often.]`; form with visible `<label>` "Email address", email input (2px cream border, transparent) + red **Subscribe** button joined flush. Leave `action` empty with a `TODO` comment.
5. Footer.

### 7.6 Article — `writing/post.html`
1. **Header** (max 860px): breadcrumb `Writing / [Topic]`, H1 `[Article title goes here]`, dek `[Dek — one sentence that tells readers why this matters.]`, byline row on a 2px navy top rule: JH monogram, "Jerome Hardaway", `[MMM DD, YYYY] · [0] min read`.
2. **Cover** 21:9 `[Cover image]` + caption `[Image credit or caption]`.
3. **Body**, two columns (wraps on mobile): left rail (220–260px, `position: sticky; top: 24px` on desktop only) = "In this post" + 3 TOC links `01 · [Section one]`… (active one red) + red reading-progress bar driven by JS + "34% read" label. Right = article column max 720px.
4. Article elements to style (this page is the **style guide** for future posts — build them as real `.prose` CSS rules, not inline):
   - Lead paragraph 21px; body 18px / 1.8.
   - H2: mono red section number + GothamPro 900 uppercase 30px.
   - Lists with 10px red square bullets.
   - Pull quote: 2px navy top rule, GothamPro 300 32px.
   - Code block: navy, header bar `[filename.py]` / `Copy` (copy button works), mono 14px; tokens: comments sky, keywords gold, strings `#F38375`.
   - Note box: white, 4px gold top border, "Field note" label, `[A tip, warning, or aside.]`.
   - Figure 16:9 + `Fig. 01 — [Caption]`.
   - Inline links red, underline.
5. **Author card** (navy): 72px photo placeholder, name, `[Short author bio.]`, gold `About me →`.
6. **Keep reading** (off-white): 2 cards `[Topic] · [0] min` / `[Related post title]`.
7. Footer.

### 7.7 Contact — `contact.html`
Two panels flush side-by-side (stack on mobile):
- **Left (navy):** corner brackets, eyebrow "Contact", H1 `Let's<br>talk.`, `[One line inviting people to reach out.]`, Radar graphic (max 320px), then a list pinned to the bottom: LinkedIn `/in/jeromehardaway`, GitHub `@jeromehardaway`, Vets Who Code `vetswhocode.io`.
- **Right (white form):** `<fieldset>` legend "What's this about?" with toggle chips `Speaking · Partnership · Hire our troops · Other` (single-select, `aria-pressed`, default Speaking; write the choice to a hidden input). Fields with visible mono labels: Name + Email (2-up), Organization (optional), Message (textarea, 6 rows). Inputs: cream fill, 1px `#6C757D` border, 52px height, 0 radius. Footer row: `[Response time note]` + red **Send message** button.
- Form backend: leave `action=""` with a `TODO: wire to form service` comment. Add basic HTML5 validation (`required`, `type="email"`).

## 8. JavaScript (`site.js`, vanilla, <150 lines)
1. Work filter chips.
2. Contact reason chips.
3. Article reading-progress bar + active TOC link on scroll.
4. Code block copy button.
5. Footer year.
6. Optional radar sweep rotation (respect reduced motion).

## 9. Responsive
- Breakpoints: work mobile-first; key widths 390, 768, 1024, 1440.
- Every multi-column layout uses `grid-template-columns: repeat(auto-fit, minmax(min(100%, Npx), 1fr))` so it stacks on its own.
- At 390px: no horizontal scroll, 16–24px gutters, H1 never overflows, all tap targets ≥44px.

## 10. Accessibility
- One `<h1>` per page; logical heading order.
- Real `<a>`, `<button>`, `<label>`; no click handlers on divs.
- Decorative SVGs `aria-hidden="true"`; meaningful SVGs `role="img"` + `aria-label`.
- Contrast ≥4.5:1 for text (use `--text-3` `#495057` for small meta on cream, `--sky` on navy — never `#6C757D` for text).
- Skip link to `<main>` on every page.

## 11. SEO / meta (every page)
- Unique `<title>` and `<meta name="description" content="[Page description]">`.
- Open Graph + Twitter card tags with `[OG image]` placeholder path.
- `<link rel="canonical" href="https://jerome.codes/...">`.
- `<html lang="en">`, viewport meta, favicon = JH monogram SVG (`assets/img/favicon.svg`: navy square, white "JH", red bottom bar).

## 12. Done when
1. All 7 pages + 404 exist and link to each other through the nav, footer, and cards.
2. The old site's files, fonts, and Font Awesome are gone; `CNAME` is unchanged.
3. Every placeholder in this spec appears verbatim on its page.
4. No layout breaks or horizontal scroll at 390, 768, 1024, 1440.
5. Lighthouse accessibility ≥95 on Home, Case study, Article, Contact.
6. Changes are on branch `redesign` with a PR opened against `main`. Do not merge.
