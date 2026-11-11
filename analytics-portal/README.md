# Truth Seekers analytics portal

A Cloudflare Worker for `analytics.truthseekersbook.com`. **The dashboard is public and read-only: no login.** Anyone with the URL can view traffic, countries, devices, channels, top pages and events. The GA4 service-account key stays in a Worker secret and is never sent to the browser.

## Setup

1. In Cloudflare Zero Trust, remove (or disable) the Access application for `analytics.truthseekersbook.com`, otherwise visitors still get a login screen.
2. Set `GA4_PROPERTY_ID` (numeric ID from GA4 Admin → Property details; not the `G-` measurement ID) in `wrangler.jsonc`.
3. Create a Google Cloud service account with the Analytics Data API enabled, give it **Viewer** on the GA4 property, and store the JSON key: `npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON`. Never commit it.
4. `npm install`, `npm run check`, `npm run deploy`.

## Abuse protection

Because the API is public: responses are cached (75 s realtime, 3 min reports) so visitors share one GA4 call, `?fresh=1` is ignored, and each IP is limited to 30 API requests per minute (best-effort, per Worker instance). Add a Cloudflare WAF rate-limiting rule on `/api/*` for a hard limit.

## Data notes

Language views are classified from the page-path string using `index-{lang}.html`, `read-{lang}.html`, and `?lang=` shared-reader links. `/read.html` defaults to English. `Other / selector` can contain homepage/navigation and uncategorized paths. Traffic, devices, channels and events are native GA4 dimensions/metrics. Summed per-page users are deliberately **not** displayed as unique users for language editions. Some audiobook or download events may require additional website tracking. GA4 data processing, API limits and quotas apply.

## Security

Nothing sensitive is exposed beyond aggregate analytics. Rotate the Google key periodically. To make the dashboard private again, restore the Cloudflare Access application and the Access JWT check from commit `9744650`.
