# Halftone Photography Pipeline

> **The single most important asset-production specification in the system.** Halftone cutouts are the defining visual element. Runtime CSS halftone filters are unreliable and performance-expensive at hero sizes — every photo is **pre-processed offline** to a transparent PNG before it lands in `/public/images/halftone/`.
>
> Source rules: design.md §7 + §11 + §1 art direction.

---

## When to use this pipeline

- Every photo of a rider, bike, group, or landscape that appears on the marketing surface.
- Founder portrait on `/about`.
- OG images (the dynamic `/api/og` route renders a halftone-treated cutout into the share card).
- Journal post hero photos.

You do **not** halftone-process functional images: form icons, map pins, reviews-widget logos, etc. Those follow normal flat-illustration treatment.

---

## What "halftone" means in this system

Two-tone, ink-only dot pattern. No grayscale gradient, no color, no white background — pure ink dots on transparency. The result should look **screen-printed** onto kraft paper, not "photo with a halftone filter." Edges are scissor-sharp, not feathered.

| Aspect           | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Color            | `--color-ink` (`#1F140E`) — never pure black                         |
| Background       | Transparent (alpha)                                                  |
| Dot size         | 4–6 (Photoshop Halftone Pattern setting). Smaller = finer, more photo. Larger = punchier, more poster. Use **5** as the default. |
| Dot shape        | Dot (NOT line, NOT circle pattern, NOT cross-hatch)                  |
| Source contrast  | Aggressive — typically +30 to +50 contrast adjustment before halftone |
| Edge treatment   | Scissor-sharp via Select Subject + Refine Edge → harden              |
| Output format    | PNG with transparency, 2× display size (retina)                      |
| Compression      | TinyPNG / ImageOptim, target ≤ 200KB per asset (CLAUDE.md §11)        |

---

## Tools

Pick one. The result should be identical regardless of tool — the steps map directly.

| Tool             | License        | Notes                                                                                         |
| ---------------- | -------------- | --------------------------------------------------------------------------------------------- |
| **Photoshop**    | Subscription   | Industry default. Has the canonical Halftone Pattern filter. **Recommended.**                 |
| **Affinity Photo** | One-time fee | Halftone via macros. Slightly different settings; document any drift in the asset's filename. |
| **GIMP**         | Free           | Newsprint filter. Less control but free. Acceptable for client batch processing.              |

The **client should be able to run this pipeline themselves** for new photos after launch. The Photoshop Action file (`/docs/halftone.atn`) ships with the project once we record it from a real photo in Phase 6.

---

## Step-by-step (Photoshop)

### 1. Open and prep

1. Open the source photo (RAW or high-res JPG).
2. Image → Mode → **Grayscale**. Discard color information when prompted.
3. Image → Adjustments → **Levels** (or Curves). Push contrast hard:
   - Black point: drag right until shadows clip slightly (~10–20)
   - White point: drag left until highlights blow (~230–245)
   - Goal: high separation between subject and background. The halftone filter rewards contrast.

### 2. Apply halftone

4. Filter → Sketch → **Halftone Pattern**. (If Sketch filters are missing in newer PS versions, enable them via Edit → Preferences → Plug-ins → "Show all Filter Gallery groups and names.")
   - Size: **5** (default)
   - Contrast: **35**
   - Pattern Type: **Dot**

### 3. Knock out the white

5. Image → Mode → **RGB Color** (so we can carry alpha).
6. Select → **Color Range** → click on a white area. Fuzziness ~30. Click OK.
7. Press **Delete**. The white background becomes transparent.
8. Select → Deselect.

### 4. Tint to ink

9. Lock transparent pixels on the layer (the small checker icon in the Layers panel).
10. Edit → **Fill** → Color → enter `#1F140E`. OK.

### 5. Cutout subject (for figures, not landscapes)

For a landscape banner you can stop here. For a figure (rider, bike, group), continue:

11. Use **Select Subject** (button on the top toolbar in newer PS, or Select → Subject menu).
12. Select → **Select and Mask** → tweak Edge Detection Radius to ~2px, contrast to +20%. Output: New Layer with Layer Mask.
13. **Hard the edges**: in the layer mask, Filter → Other → **Maximum** with radius 1px (eats feathered pixels). Confirm edges are sharp by zooming to 200%.
14. Hide the original layer; flatten the cutout into a single transparent layer.

### 6. Optional — paper-color halo

For figures placed on red zones (the hero cutout, for instance), a paper-colored thin outline can read as if scissor-cut from kraft paper. Optional, not required — design.md §7.

15. Layer → Layer Style → **Stroke**:
    - Size: 2px
    - Position: Outside
    - Color: `#E8DCC4`
    - Opacity: 100%

### 7. Export

16. File → **Export As** → PNG.
    - Width: 2× display size (e.g. 1600px wide if it'll display at 800px)
    - Smaller File / Smallest File: smaller is fine for halftone (palette-friendly)
    - Transparency: yes
17. Run output through **TinyPNG** or **ImageOptim**. Target ≤ 200KB.
18. Rename per convention: `{subject}-{location}-halftone.png`. Examples:
    - `rider-patagonia-halftone.png`
    - `group-andes-day-3-halftone.png`
    - `landscape-ruta-40-horizon.png` (banners drop the `-halftone` suffix per design.md §7)
19. Place under `/public/images/halftone/` (subjects) or `/public/images/landscapes/` (banners).

---

## Source-photo art direction

The pipeline rewards photos shot with halftone in mind. If new photography is being commissioned:

- **Backlight or strong sidelight.** Flat midday light kills halftone conversion.
- **Subjects against sky or distant backgrounds.** Easier silhouette extraction.
- **Group shots > solo shots.** Three or more riders in frame is a hero asset.
- **Shoot dirty.** Dusty bikes, mud, gear stains. Pristine kills the brand.
- **Wide environmental shots for the landscape pool.** Dramatic horizons, high dynamic range.

Existing flat phone shots in midday light may need to be **re-shot** rather than salvaged — see open question §16.

---

## What NOT to do

- ❌ Stock photography. Kills authenticity instantly.
- ❌ Drone footage with cinematic color grading. Wrong tone.
- ❌ Studio shots of bikes. We are not selling motorcycles.
- ❌ Sunset/sunrise heavily-saturated landscape shots that fight the brand red.
- ❌ Pure black `#000000` for the ink color. Use `#1F140E`.
- ❌ Feathered edges. The figure must look scissor-cut.
- ❌ Photos with five-star-hotel framing — pristine, posed, no dirt visible.
- ❌ Live CSS halftone filters at hero sizes. Pre-process.

---

## Asset budget

Per CLAUDE.md §11:

- Each halftone PNG: **≤ 200KB**
- Total image weight per page: **≤ 1.2MB**
- Hero composition (landscape banner + cutout figure): **≤ 400KB combined**
- Below-the-fold halftones lazy-load (`loading="lazy"` is the `next/image` default; only the hero gets `priority`)

Audit the budget on every new tour page.

---

## Reference for review

When reviewing a new halftone, ask:

- [ ] Does the dot pattern read as a printed halftone, or as a "filter applied"?
- [ ] Are subject edges scissor-sharp, not feathered?
- [ ] Is the ink color `#1F140E`, not pure black?
- [ ] Is the background fully transparent (no white halo)?
- [ ] Is the file under 200KB?
- [ ] Is the filename descriptive (`rider-patagonia-halftone.png`, not `IMG_4521.png`)?
- [ ] Does it sit on the brand red and the kraft paper without looking digital?

If any answer is "no," reprocess.

---

_This document is the source of truth for halftone production. Update it when the pipeline changes or when we record the Photoshop Action in Phase 6._
