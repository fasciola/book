# Truth Seekers private analytics portal

A separate Cloudflare Worker application for `analytics.truthseekersbook.com`. Does not modify the public book site. All pages and `/api/*` routes require a verified Cloudflare Access identity; the Worker checks Access JWT signature, issuer, audience, expiry, and exact permitted email. The API requests Google Analytics Data API data using a service account private key stored as a Worker secret.

## Before publishing

1. Create a **Cloudflare Access self-hosted application** for `analytics.truthseekersbook.com` with an email identity provider / One-time PIN and a strict **Allow** policy for the owner's exact email. Deny everyone else. Do not expose the Worker on an unprotected `workers.dev` hostname; disable that endpoint and previews or protect them with Access too. Configure the Worker custom domain and DNS in the zone. **The Access application must cover every route, including `/api/*`.**
2. Copy the Access application's **AUD tag** and your Cloudflare Zero Trust team domain (e.g. `your-team.cloudflareaccess.com`). Set `ACCESS_AUD`, `ACCESS_TEAM_DOMAIN`, and `OWNER_EMAIL` using Worker configuration. Never commit personal login credentials.
3. Find the **numeric GA4 property ID** under GA4 Admin → Property details. `G-TS8PC2E0GD` is a web measurement ID, **not** the numeric property ID. Set `GA4_PROPERTY_ID` to the numeric ID.
4. Create a Google Cloud service account and enable Google Analytics Data API. Give the service account email **Viewer** access to GA4 property **The Truth Book** in GA4 Access Management. Create its JSON private key; store the full JSON as the **secret** `GOOGLE_SERVICE_ACCOUNT_JSON` through `npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON`. Never commit it or send it via chat.
5. Run `npm install`, `npm run check`, then `npm run deploy` from this directory after authenticating Wrangler. Bind the custom hostname. Confirm a non-owner receives an Access challenge/denial and an owner gets real analytics results.

For local development, the Worker deliberately rejects requests without a valid Cloudflare Access assertion. There is no demo-mode or publicly accessible data API. The dashboard uses yesterday as end date to avoid mixing partial current-day numbers.

## Data notes

Language views are classified from the page-path string using `index-{lang}.html`, `read-{lang}.html`, and `?lang=` shared-reader links. `/read.html` defaults to English. `Other / selector` can contain homepage/navigation and uncategorized paths. Traffic, devices, channels and events are native GA4 dimensions/metrics. Summed per-page users are deliberately **not** displayed as unique users for language editions. Some audiobook or download events may require additional website tracking. GA4 data processing, API limits and quotas apply.

## Security

No cookie-based homemade login, no front-end GA4 token, no stored service-account key in repo. Access JWT signature and audience are verified independently of the Cloudflare edge policy. Because all requests go through the Worker (including static assets), a missing Access setup fails closed. Secrets should be scoped to the Worker. Periodically rotate Google keys and audit Access policies.
