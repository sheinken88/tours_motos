# Analytics implementation

The application initializes analytics from public environment variables:

```env
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

IDs are validated before their scripts are loaded. Missing or malformed values
disable only that provider and do not break the website.

## Loading model

- GTM loads the container and receives custom `moto_*` data-layer events.
- GA4 is initialized directly with `send_page_view: false`; the app sends one
  page view per App Router navigation.
- Meta Pixel is initialized directly; the app sends one `PageView` per
  navigation.

Do not add a second Google tag/GA4 configuration tag or Meta base-pixel tag to
the GTM container. Doing so would initialize those providers twice. GTM remains
available for Preview, inspection of the data layer, and future tags.

## Event contract

| User action | GTM data layer | GA4 | Meta |
| --- | --- | --- | --- |
| Page navigation | `moto_page_view` | `page_view` | `PageView` |
| Tour detail viewed | `moto_tour_view` | `view_item` | `ViewContent` |
| WhatsApp link clicked | `moto_whatsapp_click` | `whatsapp_click` | `WhatsAppClick` |
| Valid inquiry captured | `moto_lead` | `generate_lead` | `Lead` |

No names, emails, phone numbers, messages, or WhatsApp message text are sent to
analytics.

Lead events are emitted only when the Server Action confirms that Resend or
Sheets captured the inquiry. Honeypot submissions, failed submissions, and
deduplicated retries do not emit a lead. A server-generated event ID plus
session storage prevents the same confirmed form response from firing twice.
