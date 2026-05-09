# Google Sheets CMS Setup

> One-time setup. After this is done the client edits a single Sheet to add tours, change dates, or update availability — engineering doesn't need to ship a deploy. Cache TTL is 10 minutes; the `/api/revalidate` bookmark forces an immediate refresh.

---

## Architecture

- **Service account** with **read-only** access to one shared Spreadsheet.
- Credentials live in `GOOGLE_SHEETS_CREDENTIALS` (base64-encoded JSON) and the spreadsheet ID lives in `GOOGLE_SHEETS_TOURS_ID`. Both are environment variables on Vercel and locally in `.env.local`.
- The site reads the Sheet on demand, caches for 10 minutes, and falls back to the last-good cached version if Sheets is unreachable. So a client typo or a Sheets API blip never breaks the live site.
- A revalidation API at `/api/revalidate` flushes the cache when the client hits a bookmarked URL with a secret token.

---

## One-time GCP setup

> Estimated time: 10–15 minutes. Do this once with a Google account that will own the service account long-term.

1. **Open Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**: top-bar → New Project. Name it `moto-onoff-cms` (or similar). Note the project ID.
3. **Enable the Sheets API**:
   - Left nav → APIs & Services → Library
   - Search "Google Sheets API"
   - Click → Enable
4. **Create a service account**:
   - APIs & Services → Credentials → Create Credentials → Service account
   - Name: `moto-onoff-sheets-reader`
   - Grant access: **skip** (no GCP role needed; the only access this account needs is to one Sheet, granted in step 6)
   - Done
5. **Generate a JSON key for the service account**:
   - Click the service account → Keys tab → Add Key → Create new key → JSON → Create
   - A `.json` file downloads. **Treat this like a password.** Don't commit it.
6. **Note the service account email** (looks like `moto-onoff-sheets-reader@<project>.iam.gserviceaccount.com`). You'll use this in step 8.

---

## One-time Sheet setup

> Done by whoever owns the Sheet (typically the client).

7. **Create a new Google Sheet** in Drive. Name it `Moto On/Off — CMS` or similar.
8. **Share the Sheet with the service account email** from step 6:
   - Share → enter the email → role: **Viewer** → Send.
   - The service account doesn't have a real inbox, so the share email bouncing is fine.
9. **Note the spreadsheet ID** from the URL. The Sheet URL looks like `https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/edit`. Copy that ID — it's `GOOGLE_SHEETS_TOURS_ID`.

### Sheet schema

The Sheet must have **two tabs**: `Tours` and `Departures`. The first row of each tab is the header row, frozen.

#### Tab `Tours`

| Header | Type | Notes |
| --- | --- | --- |
| `slug` | string | Canonical slug; `/es/tours/<slug>` by default. `kebab-case`. |
| `slug_es` | string | Optional locale-specific slug. Falls back to `slug`. |
| `slug_en` | string | Optional. |
| `slug_pt` | string | Optional. |
| `title_es` | string | Title in Spanish. Required. |
| `title_en` | string | Title in English. Required. |
| `title_pt` | string | Title in Portuguese. Required. |
| `region` | string | Display label, e.g. "Patagonia", "Norte Argentino". |
| `difficulty` | enum | One of `easy` / `moderate` / `hard` / `expert`. |
| `duration_days` | integer | Positive. |
| `distance_km` | integer | Positive. |
| `base_price_usd` | number | Positive. |
| `currency` | enum | `USD` / `ARS` / `EUR`. Defaults to `USD`. |
| `hero_image` | string | Path under `/public`, e.g. `/images/halftone/patagonia-raw-hero.png`. |
| `published` | boolean | `TRUE` / `FALSE` / `yes` / `no` / `1` / `0`. Empty = `FALSE`. Only `TRUE` rows ship. |

#### Tab `Departures`

| Header | Type | Notes |
| --- | --- | --- |
| `tour_slug` | string | Must match a `slug` in the `Tours` tab. |
| `start_date` | date | `YYYY-MM-DD`. |
| `end_date` | date | `YYYY-MM-DD`. |
| `capacity` | integer | Positive. |
| `spots_remaining` | integer | Non-negative. |
| `status` | enum | `open` / `low` / `sold_out`. |
| `notes` | string | Optional. Free text, displayed on the tour page. |

A row that fails validation is **skipped + logged** — the rest of the Sheet still ships. Check Vercel logs for `[sheets] skipped malformed ...` if a tour disappears.

---

## Wiring credentials into Vercel + local dev

10. **Encode the service account JSON to base64**:

    ```bash
    base64 -i path/to/service-account.json | pbcopy
    # macOS — copies to clipboard
    ```

    On Linux: `base64 -w0 service-account.json | xclip -selection clipboard`.

11. **Set Vercel environment variables**:
    - Project → Settings → Environment Variables
    - Add:
      - `GOOGLE_SHEETS_CREDENTIALS` = (paste the base64 string)
      - `GOOGLE_SHEETS_TOURS_ID` = (the ID from step 9)
      - `REVALIDATE_SECRET` = (a long random string — `openssl rand -hex 32`)
    - Apply to Production + Preview + Development.

12. **Set local `.env.local`** (gitignored — never commit):

    ```env
    GOOGLE_SHEETS_CREDENTIALS=<paste base64>
    GOOGLE_SHEETS_TOURS_ID=<paste sheet ID>
    REVALIDATE_SECRET=<some-long-random-string>
    ```

13. **Verify**: hit `/api/tours` locally — `source` should switch from `"mock"` to `"configured"` and the data should match the Sheet.

---

## Mock fallback (Phase 5–7 dev)

Before real credentials land, `lib/sheets/mock.ts` ships three sample Argentine tours so pages render. The fallback fires when:

- `GOOGLE_SHEETS_CREDENTIALS` is missing, OR
- `GOOGLE_SHEETS_CREDENTIALS` equals the literal string `PLACEHOLDER_BASE64_SERVICE_ACCOUNT_JSON`, OR
- `GOOGLE_SHEETS_TOURS_ID` is missing or equals `PLACEHOLDER_SHEET_ID`.

Switching to real data is purely an environment-variable change — no code edits.

---

## Client refresh bookmark

After the Sheet is edited, the cache picks up changes automatically within 10 minutes. For an instant refresh:

1. Bookmark this URL (replace `<SECRET>` with the value of `REVALIDATE_SECRET`):

   `javascript:fetch('https://motoonoff.com/api/revalidate?secret=<SECRET>',{method:'POST'}).then(r=>r.json()).then(d=>alert('OK · '+d.tags.join(', ')+' refreshed'))`

   (A javascript: bookmark — clicking it from any tab fires the revalidate.)

2. Or for a CLI:

   ```bash
   curl -X POST -H "x-revalidate-secret: <SECRET>" https://motoonoff.com/api/revalidate
   ```

The response shape is `{ revalidated: true, tags: [...], timestamp: "..." }`. A 401 means the secret is wrong.

---

## Failure-mode summary (CLAUDE.md §6)

| What broke | What happens |
| --- | --- |
| Sheets API unreachable | Cached payload keeps serving until the next successful fetch. |
| Invalid row in `Tours` | Row is skipped + logged. Other rows ship. |
| `published = FALSE` | Row is excluded from production. |
| Service account loses Sheet access | Pages stay live on cached payload. Next revalidation sets `tours = []` → tour index falls back to its empty state. |
| `GOOGLE_SHEETS_CREDENTIALS` removed in prod | Mock data ships. Surfaces stay live but show only the three sample tours. |

---

_Update this doc when the schema changes. The schema is the single contract between engineering and the client._
