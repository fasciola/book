# Spare Some Minutes — cinematic cut-out prompts for ChatGPT (v2, "Olive Tree at Dawn")

Inspired by two references: **Aurora** (a floating island above a sea of clouds, huge serif headline, a lone traveller seen from behind) and **ATMA** (a luminous golden olive tree in a misty pastel valley, centred headline with golden highlighted words).

## The concept

The book's story is a search: from confusion → questions → a long road → light. The site is that journey as one continuous **dawn landscape**:

| Section | What you see |
| --- | --- |
| **Hero** | Dawn sky, layered misty mountains, a giant golden **olive tree** in the valley, doves crossing, small floating islands (a glowing open book, a lamp). Centred headline "The Earth is *Home* to all Creatures" with the gold word. |
| **Three questions** | Three floating islands in the clouds — Truth (lamp), Happiness (sapling), Humanity (shared harvest) — each with a glass card beneath. |
| **The Journey (4 parts)** | A winding path up a cliff; a lone seeker seen from behind with a lantern; four glowing stops = the four parts of the book. |
| **Quote** | Sea of clouds at sunrise, a dove, a glowing book, one pull-quote. |
| **Languages** | A glass globe with eight language orbs circling it. |
| **Download** | A stack of books resting on a small cloud. |
| **Footer** | Misty olive hills. |

Layers drift at different speeds on scroll (parallax), so **every layer must be its own transparent image**.

---

## 0. How to run it in ChatGPT

1. Open a **new chat**. Attach the two reference screenshots (Aurora, ATMA) and paste the **MASTER STYLE BLOCK** (section 1). Add: *"Remember this as the style for every image I ask for in this chat. Reply only 'ready'."*
2. Paste **one prompt at a time** (section 3). One image per message, at the size shown. Download as PNG/JPG and name it exactly as listed.
3. **Transparency check** on a dark and a light background. If there's a white/grey box, a drawn checkerboard, or a floor shadow, reply:
   *"Regenerate the same object on a perfectly transparent background (real alpha channel, PNG). No background, no ground, no shadow."* If it still fails, ask for **flat pure white (#FFFFFF)** with wide margin and send it to me — I'll cut it out locally.
4. **Clouds, mist, light rays and sparkles are NOT cut-outs.** Soft semi-transparent things can't be exported cleanly, so those prompts ask for **a solid pure-black background** (`.jpg`). I blend them with `mix-blend-mode: screen`, which makes black vanish perfectly.
5. Save everything into `public/assets/cutouts/`.

---

## 1. MASTER STYLE BLOCK (paste once per chat)

```
STYLE FOR ALL IMAGES IN THIS CHAT — "Olive Tree at Dawn", a cinematic, luminous,
dreamlike digital matte painting for a contemplative book about the search for truth.

Look: high-end concept-art / premium website hero quality. Soft volumetric light, gentle
atmospheric haze, delicate depth, painterly realism with a touch of fantasy. Calm, hopeful,
spiritual but universal. NOT cartoon, NOT flat vector, NOT neon, NOT oversaturated, NOT
cluttered.

Palette: dawn sky — soft lavender #B9B2D9, peach #F3C9A8, pale gold #F1D48A, dusty blue
#8FA8D6, deep indigo #1B2547 for depth; accents in glowing antique gold #D9B45A and ivory
#F5EFE0; olive greens #A9B88A / #6F7F4A. Warm golden key light from the upper-left, cool
lavender fill from the right.

Composition: ONE subject centred, fully visible, never cropped by the frame, with at least
8% empty margin on every side, strong readable silhouette, crisp clean edges so it can be
cut out and layered over text and other images.

BACKGROUND: perfectly transparent (real alpha channel, PNG): no sky, no ground, no floor, no
vignette, no glow outside the object, no cast shadow, no checkerboard, no frame.
(Exception — prompts marked "ON BLACK": use a solid pure #000000 background.)

Content rules: no text, no letters, no numbers, no calligraphy, no logos, no watermarks,
no faces. People only where a prompt says so, seen from behind as a small silhouette, with no
religious clothing or symbols. Never depict prophets, religious figures or sacred lettering.
Any book pages show only soft abstract lines.
```

---

## 2. Spec

| Item | Requirement |
| --- | --- |
| Format | PNG with real alpha (JPG only where marked ON BLACK / BACKGROUND) |
| Sizes | wide 1536×1024 · tall 1024×1536 · square 1024×1024 (max ChatGPT offers) |
| Edges | Crisp, no white/black halo |
| Consistency | Same light direction (upper-left) and palette everywhere |

---

## 3. PROMPTS (priority order — P1 is enough for a first launch)

### P1 · Hero (the stars)

**`sky-dawn.jpg` · 1536×1024 · BACKGROUND (not a cut-out)**
```
A wide dreamy dawn sky with no objects at all: deep indigo at the top blending down through
lavender and dusty blue to glowing peach and pale gold at the horizon, soft volumetric clouds
lit from below, a few faint distant stars at the very top, gentle light rays from a hidden
sun low on the horizon at centre. Empty centre area, no birds, no mountains, no text.
```

**`olive-tree.png` · 1536×1024 · wide · hero centrepiece**
```
A majestic ancient olive tree, wide and gracefully twisted trunk splitting into several
sweeping branches, a broad airy canopy of luminous silver-green leaves with warm glowing
gold edges and a scattering of small golden olives, tiny sparkling light motes among the
leaves. Soft golden rim light from the upper-left. The trunk ends in a few visible roots at
the bottom with a small mound of earth, cut off cleanly (no ground beyond it). Whole tree
fully visible. Transparent background, no shadow outside the object.
```

**`mountains-far.png` · 1536×1024 · wide**
```
Three overlapping layers of distant misty mountain ridges in pale lavender and dusty blue,
each ridge lighter and hazier than the one behind, soft atmospheric perspective, a gentle
peach glow along the tops. The bottom of the image is filled with soft white-gold mist so it
blends into a landscape. Transparent background above the ridges, no sky.
```

**`mountains-near.png` · 1536×1024 · wide**
```
A foreground band of softly rolling olive-green and sage hills with a few small olive trees
and tiny golden wildflowers, darker and more saturated than distant mountains, a gentle
mist rising at the base. A calm valley dip in the centre where a tree could stand. The hills
fill the lower third; everything above the hills is transparent. No sky.
```

**`dove-flight.png` · 1536×1024 · wide**
```
A single white dove in graceful mid-flight, wings raised and spread, carrying a small olive
sprig in its beak, soft realistic feathers lit with warm gold on the upper-left edges and
cool lavender on the lower edges. Side view, whole bird visible. Transparent background, no
glow, no shadow.
```

**`island-book.png` · 1024×1024 · floating island (top-right of hero)**
```
A small floating island: a chunk of earth with hanging roots and a thin waterfall of golden
light falling from one edge, topped with soft grass and one large open antique book standing
upright and glowing warmly, pages gently lifting, abstract lines instead of writing, a few
loose pages fluttering above. Whole island visible. Transparent background, no mist, no
shadow outside the object.
```

### P2 · "Three questions" islands (matched set — same angle and scale)

**`island-lamp.png` · 1024×1024 · Truth**
```
A small floating island of earth and rock with hanging roots, soft moss on top, holding a
brass oil lamp with a steady gold flame, a few glowing sparks drifting up. Three-quarter
view, whole island visible. Transparent background, no shadow outside the object.
```

**`island-sapling.png` · 1024×1024 · Happiness**
```
A small floating island of earth and rock with hanging roots, on top a young olive sapling
with silver-green leaves and a few tiny golden olives, soft green grass and tiny white
flowers. Three-quarter view, whole island visible. Transparent background, no shadow outside
the object.
```

**`island-harvest.png` · 1024×1024 · Humanity**
```
A small floating island of earth and rock with hanging roots, on top a long wooden table
laden with a shared harvest: dates, figs, pomegranates, grapes, flat bread and a pitcher,
a few olive leaves scattered. Three-quarter view, whole island visible, no people.
Transparent background, no shadow outside the object.
```

### P3 · The Journey

**`path-cliff.png` · 1024×1536 · tall**
```
A tall slender cliff-face rock pillar rising out of clouds, a narrow winding stone path with
shallow steps spiralling up it to a flat summit, a few olive shrubs and golden-lit grass on
ledges, four small glowing golden lanterns marking stops along the path at different heights.
Whole pillar visible, clouds NOT included. Transparent background, no shadow outside the
object.
```

**`traveler.png` · 1024×1536 · tall**
```
A small lone seeker seen from behind, standing and looking up, long plain neutral travel
cloak, simple walking staff, holding a small glowing lantern at the side. Pure silhouette
with soft rim light on the left edge, no face, no religious clothing or symbols. Whole figure
visible. Transparent background, no ground, no shadow.
```

### P4 · Languages, downloads, closing

**`globe-glass.png` · 1024×1024**
```
A luminous glass globe of the Earth floating, oceans deep blue, continents soft olive and
gold, a thin ring of olive leaves in gold encircling it like an orbit, tiny sparkles. No
readable names or letters. Whole globe visible. Transparent background, no glow outside the
object.
```

**`orb-glass.png` · 1024×1024 · reused eight times, one per language**
```
A single clear glass sphere with a soft gold-lavender gradient inside, subtle reflection of a
window on the upper-left, a tiny sparkle, no content inside, no text. Transparent
background, no shadow.
```

**`books-cloud.png` · 1024×1024**
```
A neat stack of five antique books in navy, ivory, olive, terracotta and brass-gold bindings
(ornament only, no lettering), a ribbon bookmark hanging out, resting on a small soft
volumetric cloud. Whole group visible. Transparent background around the cloud, no shadow.
```

**`hills-foot.png` · 1536×1024 · wide (page footer)**
```
A wide band of misty rolling olive-grove hills seen across a valley, rows of tiny olive trees
in silver-green, a few golden-lit tops, soft white mist drifting between the hills, the
bottom edge filled solid with deep indigo (#0A0F1E) so it merges into the page. Everything
above the hills is transparent.
```

### P5 · Atmosphere (ON BLACK — blended with `screen`; save as .jpg)

| File | Size | Prompt (add to master style; **solid pure black background**) |
| --- | --- | --- |
| `cloud-bank.jpg` | 1536×1024 | A wide, soft bank of volumetric cumulus cloud lit gold on top and lavender beneath, drifting horizontally, ON BLACK. |
| `cloud-wisp.jpg` | 1536×1024 | Thin delicate high-altitude wispy clouds in pale gold and white, ON BLACK. |
| `rays.jpg` | 1536×1024 | Soft golden god-rays fanning down from the top centre, gentle and faint, ON BLACK. |
| `sparkles.jpg` | 1024×1024 | Scattered tiny gold light motes and soft bokeh orbs of different sizes, ON BLACK. |

### P6 · Floating accents (small objects, 1024×1024, transparent)

| File | Prompt |
| --- | --- |
| `f-leaf-gold.png` | A single olive leaf branch with six silver-green leaves edged in glowing gold. |
| `f-feather.png` | One white feather, soft and slightly curled, drifting, lit gold on its left edge. |
| `f-pages.png` | Three loose antique book pages mid-flutter, soft abstract lines instead of writing, gold edges. |
| `f-star.png` | An eight-pointed geometric star in glowing antique gold with fine inlaid lines, flat decorative, perfectly symmetrical. |
| `f-lantern.png` | A small floating paper-and-brass lantern with a warm gold glow inside. |

### P7 · Bonus pages (tell me and I'll wire them in)

| File | Size | Prompt |
| --- | --- | --- |
| `dove-letter.png` | 1536×1024 | A white dove in flight carrying a small sealed cream envelope with a blank gold wax seal in its beak. (Contact page) |
| `desk-window.png` | 1536×1024 | A writer's desk still life as one cut-out group: an open notebook, a pen, round reading glasses, a small cup of tea, a brass lamp; no surface beyond the objects. (Author page) |

---

### P8 · "Many paths, one Truth" — the book's central idea

**Guardrails for this set (add to the master style block):**
```
RELIGIOUS-CONTENT RULES: show traditions only through architecture, objects, patterns and
nature — never through people, prophets, deities or sacred lettering. Every tradition gets
EQUAL size, weight, and light; nothing is mocked, ranked or caricatured. Emblems are small
abstract geometric forms (crescent, cross, star of David, om, wheel, khanda, torii, yin-yang,
Bahá'í nine-pointed star, Faravahar-style wings, dreamcatcher feather ring, Jain hand) drawn
respectfully and accurately, never distorted. Convergence is shown by LIGHT, WATER and PATHS
meeting — not by one symbol crushing another.
```

*To use: paste the guardrails once, then send each "What it shows" cell as the prompt (it is complete on its own), at the size in the File column.*

| # | File · size | What it shows | Where it goes |
| --- | --- | --- | --- |
| 1 | `many-paths-one-summit.png` · 1024×1536 tall | One great mountain peak with **seven different paths** (stone stair, dirt trail, rope bridge, forest track, desert track, river path, marble steps) winding up from different sides and all meeting at the summit, where a soft golden light shines. No figures. | Hero of the "Journey" section — replaces `path-cliff` as the big idea |
| 2 | `one-light-many-lamps.png` · 1536×1024 wide | A row of **eight lamps from different cultures** (brass oil lamp, clay diya, hanging mosque-style lantern, paper lantern, candle in glass, standing candelabra, Moroccan star lantern, stone lamp), each lit from **a single golden thread of light** coming from above, no text. | Language/unity section and the About page |
| 3 | `prism-light.png` · 1536×1024 wide | A crystal prism floating. One pure white-gold beam enters from the left, splits into a soft spectrum of colours fanning right, and a second faint beam from the far right merges those colours back into one white light. Elegant, no lens flare outside the object. | "One Truth, many colours" band; chapter 1 header |
| 4 | `rivers-to-sea.png` · 1536×1024 wide | A top-down map-like illustration cut-out: many different streams (blue, green, silver, gold) starting from separate spring sources at the top edge and flowing together through mountains into one calm golden-lit lake. No labels. | "Different sources, one sea" section |
| 5 | `one-tree-many-branches.png` · 1536×1024 wide | The golden olive tree again, but each major branch ends in a small round **medallion** bearing a different respectful abstract emblem (crescent and star, cross, Star of David, om, dharma wheel, khanda, torii, yin-yang, Bahá'í star, wings emblem, hand with wheel, feather ring). All twelve the same size, same gold frame. | Hero alternative / "Truth Seekers" page. Echoes your `Design1.jpg` as a cut-out |
| 6 | `houses-of-worship.png` · 1536×1024 wide | A skyline of **different houses of worship in equal scale**, side by side on a thin strip of earth: a domed mosque with minarets, a stone church, a synagogue, a Hindu temple tower, a Buddhist pagoda, a Sikh gurdwara dome, a Shinto torii gate. Each lit warm from one shared light source above, mist at their feet. | "One humanity" section; quote band |
| 7 | `books-open-together.png` · 1536×1024 wide | Several sacred-book objects resting side by side on a low stand, all **closed or open to ornamental pages, no lettering**: a scroll, a bound codex, a book on a folding wooden stand, a palm-leaf manuscript, a wrapped cloth-bound scripture. A single beam of golden light falls on all of them. | Chapters page; "Torah · Gospel · Quran · philosophy" band |
| 8 | `bridge-islands.png` · 1536×1024 wide | Several small floating islands, each topped with a different style of architecture (dome, spire, pagoda, stone arch), all linked by **delicate glowing golden rope bridges** to one central larger island with a lit lantern. Whole group visible. | The three-islands section extended: "divisions healed" |
| 9 | `open-door-light.png` · 1024×1536 tall | A tall arched doorway standing alone in a mist, half open, **golden light streaming out of it**, a ring of many different antique keys hanging from a hook beside it, each different in style and metal. | "Truth is a door" teaser; Author page |
| 10 | `compass-light.png` · 1024×1024 square | An antique brass compass, its needle pointing to a small glowing star at the top rim instead of north; the dial marked with soft abstract marks, no letters. | Chapters/Read header; a floating accent everywhere |
| 11 | `seeds-to-tree.png` · 1536×1024 wide | Left to right: many different seeds and seed pods (olive, date, pomegranate, grape, wheat, lotus, cedar cone) travelling in a gentle golden stream and **growing into one small sapling** at the right with a glowing tip. | Section header "Every seeker starts somewhere" |
| 12 | `circle-of-light.png` · 1024×1024 square | A ring of eight small glowing orbs, each a different soft colour, evenly spaced and **all linked by thin golden light to a bright white-gold star at the centre**, like a mandala/compass rose, no symbols inside. | Quote band background; loader; Languages section ring |

**Atmosphere ON BLACK** (screen-blended, save as .jpg): `light-beam.jpg` (one tall golden beam from the top, soft edges) and `dove-flock.jpg` (a loose flock of white doves rising, soft focus).

**Optional hero idea — "the dawn of agreement":** `horizon-convergence.png` · 1536×1024: from the horizon, **many golden roads fan out toward the viewer** across a plain, all vanishing at one rising sun on the horizon. Layer it behind the olive tree for a different hero variant.

#### How I'd use them (a new "One Truth" story, 5 beats)

1. **Many paths** — `many-paths-one-summit` with the headline "Seven roads. One summit."
2. **One light** — `one-light-many-lamps` + `prism-light`, "The same light, in many hands."
3. **One source** — `rivers-to-sea` and `seeds-to-tree`, "Every stream finds the sea."
4. **One humanity** — `houses-of-worship` + `bridge-islands`, "Different homes, one earth."
5. **The door** — `open-door-light` + `compass-light`, "Spare some minutes — and walk through."

Tell me which you generate and I'll build the section (the structure is the same as the existing islands/journey sections).

---

## 4. Quality checklist

- [ ] PNG cut-outs: transparent, no box/halo/checkerboard/shadow plate on dark **and** light backgrounds.
- [ ] ON BLACK files: truly pure black, nothing but light/cloud.
- [ ] Whole subject visible, nothing cropped, margin all round.
- [ ] **No text, letters or numbers** anywhere; no faces; no religious figures.
- [ ] Same light direction (upper-left) and palette; the three islands look like a set.

## 5. Where each file goes (already wired in `index-en.html` / `index.html`)

Hero: `sky-dawn`, `mountains-far`, `mountains-near`, `olive-tree`, `dove-flight`, `island-book`, `rays`, `cloud-bank`, `sparkles`, `f-*` · Questions: `island-lamp/sapling/harvest` · Journey: `path-cliff`, `traveler`, `f-lantern` · Quote: `cloud-bank`, `dove-flight`, `f-pages` · Languages: `globe-glass`, `orb-glass` · Downloads: `books-cloud` · Footer: `hills-foot`. Missing files simply don't show, and CSS gradients stand in for the sky, so the page looks fine while you generate them.
