# Google Sheets Departures Setup

> Current implementation note: Google Sheets is used only for departures and
> calendar availability. Tour metadata, itinerary content, gallery references,
> and route images are static repo content. Older `Tours`, `Itinerary`,
> `Includes`, and `Gallery` tab notes below are retained as legacy reference,
> not as the active production contract.

---

## Architecture

- **Source of truth:** one Google Sheet tab for `Departures`.
- **Auth:** Google Sheets API with a read-only service account.
- **Runtime:** Next.js server components read departure rows through `lib/sheets/`.
- **Validation:** departure rows are parsed through Zod. Malformed rows are skipped
  and logged; the rest of the site continues rendering.
- **Caching:** data is cached for 10 minutes with Next cache tags. The manual
  revalidate endpoint flushes departure data immediately when needed.
- **Images:** route images are local optimized assets in `public/images/optimized/`,
  not Google Drive URLs.

---

## One-time GCP setup

1. Open Google Cloud Console: https://console.cloud.google.com/
2. Create or select a project, e.g. `moto-onoff-cms`.
3. Enable **Google Sheets API**:
   APIs & Services → Library → Google Sheets API → Enable.
4. Create a service account:
   APIs & Services → Credentials → Create Credentials → Service account.
5. Skip project roles. The account only needs direct access to one Sheet.
6. Create a JSON key:
   Service account → Keys → Add Key → Create new key → JSON.
7. Copy the service account email. It looks like:
   `moto-onoff-sheets-reader@<project>.iam.gserviceaccount.com`.

Treat the JSON key like a password. Never commit it.

---

## One-time Sheet setup

1. Create a Google Sheet named `Moto On/Off — Departures`.
2. Share it with the service account email as **Viewer**.
3. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/edit`.
4. Create the `Departures` tab.
5. Freeze row 1 in every tab.
6. Protect row 1 so the client cannot accidentally rename/delete headers.
7. Add dropdown validations for enum fields listed below.

---

## Legacy Route Tabs

The route tabs below document the older CMS shape. They are not used by the
current production route pages.

---

## Tab: `Tours`

One row per tour. This controls the tour card, SEO metadata, hero content, and
the route facts displayed on the detail page.

| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| `slug` | yes | string | Stable join key. Use kebab-case. Do not change after publishing. |
| `sort_order` | no | integer | Display order on indexes. Empty = `0`. |
| `published` | yes | boolean | `TRUE`/`FALSE`. New tours should start as `FALSE`. |
| `slug_es` | yes | string | Spanish public URL slug. Can differ from the stable `slug` join key. |
| `slug_en` | yes | string | English public URL slug. Localize for the search terms in that language. |
| `slug_pt` | yes | string | Portuguese public URL slug. Localize for the search terms in that language. |
| `title_es` | yes | text | Tour title. |
| `title_en` | yes | text | Human-written English title. |
| `title_pt` | yes | text | Human-written Portuguese title. |
| `region_es` | yes | text | Example: `Salta y Jujuy`. |
| `region_en` | yes | text | Localized region label. |
| `region_pt` | yes | text | Localized region label. |
| `difficulty` | yes | enum | `easy`, `moderate`, `Intermediate++`, `hard`, `expert`. |
| `duration_days` | yes | integer | Positive number. |
| `distance_km` | yes | integer | Total route distance. |
| `ripio_percent` | no | integer | Percent gravel/dirt. Leave empty if unknown. |
| `max_altitude_m` | no | integer | Max altitude in meters. Leave empty if not relevant. |
| `base_price_usd` | yes | number | `0` means “consultar”. |
| `currency` | yes | enum | `USD`, `ARS`, `EUR`. |
| `hero_image` | no | URL/path | Local path like `/images/tours/...png` or public URL. |
| `hero_image_drive_id` | no | string | Drive file ID fallback if `hero_image` is empty. |
| `hero_image_color` | no | URL/path | Optional color sibling for hover reveals. |
| `hero_image_color_drive_id` | no | string | Drive file ID fallback for color image. |
| `hero_image_alt_es` | yes | text | Meaningful image alt text. |
| `hero_image_alt_en` | yes | text | Meaningful image alt text. |
| `hero_image_alt_pt` | yes | text | Meaningful image alt text. |
| `summary_es` | yes | text | Detail-page overview paragraph. |
| `summary_en` | yes | text | Human-written translation. |
| `summary_pt` | yes | text | Human-written translation. |
| `tagline_es` | no | text | Short hero line under title. |
| `tagline_en` | no | text | Human-written translation. |
| `tagline_pt` | no | text | Human-written translation. |
| `seo_title_es` | no | text | Optional override; otherwise title is used. |
| `seo_title_en` | no | text | Optional override. |
| `seo_title_pt` | no | text | Optional override. |
| `seo_description_es` | no | text | 140–160 chars preferred. |
| `seo_description_en` | no | text | 140–160 chars preferred. |
| `seo_description_pt` | no | text | 140–160 chars preferred. |

---

## Tab: `Itinerary`

One row per day per tour. A 7-day tour has 7 rows.

| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| `tour_slug` | yes | string | Must match `Tours.slug`. |
| `day_number` | yes | integer | Starts at `1`. |
| `title_es` | yes | text | Example: `Salta Capital → Cachi`. |
| `title_en` | yes | text | Human-written translation. |
| `title_pt` | yes | text | Human-written translation. |
| `route_from` | no | text | Optional structured start point. |
| `route_to` | no | text | Optional structured end point. |
| `distance_km` | no | integer | Day distance. |
| `surface_es` | no | text | Example: `70% asfalto`. |
| `surface_en` | no | text | Human-written translation. |
| `surface_pt` | no | text | Human-written translation. |
| `max_altitude_m` | no | integer | Day max altitude. |
| `body_es` | yes | text | Day description. |
| `body_en` | yes | text | Human-written translation. |
| `body_pt` | yes | text | Human-written translation. |
| `highlights_es` | no | pipe list | Separate items with `\|`: `Abra del Acay \| Salinas Grandes`. |
| `highlights_en` | no | pipe list | Human-written translation. |
| `highlights_pt` | no | pipe list | Human-written translation. |

Use one cell per language for the day body. Do not ask the client to write
Markdown; the site handles layout, headings, stamps, and X-bullets.

---

## Tab: `Departures`

One row per scheduled departure.

| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| `tour_slug` | yes | string | Must match `Tours.slug`. |
| `start_date` | yes | date | `YYYY-MM-DD`. |
| `end_date` | yes | date | `YYYY-MM-DD`. |
| `capacity` | yes | integer | Positive number. |
| `spots_remaining` | yes | integer | `0` or greater. |
| `status` | yes | enum | `open`, `low`, `sold_out`. |
| `price` | no | number | Departure-specific override. Empty = `0`. |
| `currency` | yes | enum | `USD`, `ARS`, `EUR`. |
| `notes_es` | no | text | Short public note. |
| `notes_en` | no | text | Human-written translation. |
| `notes_pt` | no | text | Human-written translation. |

If exact availability might change faster than the cache, keep CTA language
consultative: “Hold a spot” / “Talk to us” rather than “Buy now”.

---

## Tab: `Includes`

One row per bullet. This tab powers “Qué incluye”, “Qué no incluye”, and
“Lo que conviene saber”.

| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| `tour_slug` | yes | string | Must match `Tours.slug`. |
| `type` | yes | enum | `included`, `not_included`, `need_to_know`. |
| `sort_order` | no | integer | Display order within that type. |
| `text_es` | yes | text | Bullet text. |
| `text_en` | yes | text | Human-written translation. |
| `text_pt` | yes | text | Human-written translation. |

---

## Tab: `Gallery`

One row per image.

| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| `tour_slug` | yes | string | Must match `Tours.slug`. |
| `sort_order` | no | integer | Display order. |
| `featured` | no | boolean | Future use. |
| `image_url` | no | URL/path | Preferred if image is already CDN/local. |
| `image_drive_id` | no | string | Drive file ID fallback if `image_url` is empty. |
| `alt_es` | yes | text | Meaningful image alt text. |
| `alt_en` | yes | text | Human-written translation. |
| `alt_pt` | yes | text | Human-written translation. |
| `caption_es` | no | text | Optional public caption. |
| `caption_en` | no | text | Human-written translation. |
| `caption_pt` | no | text | Human-written translation. |

---

## Image workflow

### First-pass Drive workflow

1. Client uploads image files to a shared Google Drive folder.
2. File is shared as **Anyone with the link can view**.
3. Paste the Drive file ID into `hero_image_drive_id` or `image_drive_id`.

The file ID is the part after `/d/` in a URL like:

```text
https://drive.google.com/file/d/FILE_ID_HERE/view
```

The app converts that ID into a direct Drive image URL. This is convenient, but
Drive is not a real CDN: hotlinking, redirects, throttling, and large originals
can hurt performance.

### Preferred production workflow

Use Drive as the client upload inbox, then move approved/processed images to a
real delivery location:

- local `/public/images/...` assets for launch-critical images, or
- a CDN/image host such as Cloudinary, ImageKit, or Vercel Blob.

The Sheet schema already supports this via `hero_image` and `image_url`, so the
delivery source can change without changing page code.

Brand reminder: marketing images should be halftone-processed before final use.
Drive upload alone does not create the brand treatment.

---

## Environment variables

Encode the service account JSON:

```bash
base64 -i path/to/service-account.json | pbcopy
```

Set these locally in `.env.local` and in Vercel:

```env
GOOGLE_SHEETS_CREDENTIALS=<base64 service account json>
GOOGLE_SHEETS_TOURS_ID=<spreadsheet id>
REVALIDATE_SECRET=<long random string>
```

Generate a revalidate secret with:

```bash
openssl rand -hex 32
```

---

## Verify locally

Run the site and hit:

```text
/api/tours
```

Expected:

- `source` switches from `mock` to `configured`.
- tour count matches published rows in `Tours`.
- malformed rows are skipped and logged with `[sheets] skipped malformed ...`.

---

## Manual refresh bookmark

The cache refreshes automatically within 10 minutes. For instant refresh after
a big Sheet edit, bookmark this URL with the production domain and secret:

```text
javascript:fetch('https://motoonoff.com/api/revalidate?secret=<SECRET>',{method:'POST'}).then(r=>r.json()).then(d=>alert('OK · '+d.tags.join(', ')+' refreshed'))
```

Or via CLI:

```bash
curl -X POST -H "x-revalidate-secret: <SECRET>" https://motoonoff.com/api/revalidate
```

---

## Client-proofing checklist

- Freeze and protect row 1 in every tab.
- Protect hidden helper/example columns if added.
- Use dropdowns for:
  `published`, `difficulty`, `currency`, `status`, `type`, `featured`.
- Keep `published = FALSE` until all required rows exist in all three languages.
- Never change `slug` after a tour is published unless redirects are planned.
- Use `tour_slug` joins, not tour titles.
- Add a hidden `README` tab with the column explanations from this file.
- Keep a sample unpublished tour row for the client to duplicate.
- Review Vercel logs after the first real content entry pass.

---

## Failure modes

| What broke | What happens |
| --- | --- |
| Sheets API unreachable | Cached payload keeps serving until the next successful fetch. |
| One malformed row | That row is skipped and logged; other rows render. |
| `published = FALSE` | Tour is excluded from public pages. |
| Missing itinerary row | Other tour content still renders; missing day is simply absent. |
| Service account loses Sheet access | Existing cached pages remain; fresh cache reads return empty data and log errors. |
| Credentials missing locally | Mock data renders so development can continue. |

Update this document whenever the schema changes. This is the contract between
the client-facing Sheet and the website.
