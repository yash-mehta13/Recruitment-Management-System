# Security and privacy

## Current state (what actually exists)
- **No authentication, no roles, no server.** Anyone who can load the page can use every feature.
- **Data stays in the browser.** Candidate data is bundled demo data plus whatever the user types, saved in that browser's `localStorage`. Nothing is sent anywhere; the app makes no network requests for data.
- **React escaping.** Values are rendered as text by React (no `dangerouslySetInnerHTML`).
- **CSV formula-injection guard** on export (cells beginning `= + - @ TAB CR` are prefixed with `'`).
- **Input validation** on forms and on data loaded from storage.
- Dependencies were audited with `npm audit` at the time of this change (0 findings); that is a point-in-time result.

## Trust boundaries
Everything in the page is under the control of the visitor: they can read, edit or delete `localStorage`, alter state with developer tools, and read all shipped JavaScript and demo data. Client-side rules (stage transitions, validation) are usability aids, **not access control**. A static frontend cannot enforce permissions.

## Privacy risks
- **Do not use real candidate data in a publicly hosted copy.** Anything bundled in `src/data/data.js` is downloadable by every visitor. Anything typed into a browser is stored unencrypted in that browser profile (shared computers, browser sync, extensions).
- A public-read S3 bucket exposes every object to everyone.
- Exported CSVs contain names and emails: store them securely and delete them when no longer needed.
- Screenshots and docs use synthetic data only.

## Recommendations (not implemented)
- For real recruitment data: a backend with authentication, role-based authorization, server-side validation, encryption in transit and at rest, audit logging, and a data-retention policy.
- Serve over HTTPS (CloudFront with OAC in front of a private bucket) with security headers such as a Content-Security-Policy.
- Keep AWS credentials in SSO/roles or CI secrets, never in the repository.
- Check applicable privacy law (e.g. GDPR) before processing real candidate data.

See [SECURITY.md](../SECURITY.md) for reporting issues.
