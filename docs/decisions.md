# Decisions

## 1. Keep React 18 + Vite; fix the build instead of migrating
The project already used them. The build was broken (misnamed `vit.config.js`, `index.html` script without `type="module"`, `main.jsx` using `React`/`ReactDOM` without imports) and produced an empty bundle. Fixing these was smaller and safer than changing tools.

## 2. Frontend-only, with `localStorage`
A static site on S3 serves files; it cannot authenticate users or hold shared records. Providing shared, authenticated data needs a server component (API + database + auth). That would change the project's nature and cost, so it is documented as future work. `localStorage` makes the demo feel real while being honest that data is per-browser.

## 3. Versioned storage key with whole-document validation
`rms.applicants.v1` with `{version, applicants}`. If anything is off, fall back to demo data and tell the user rather than partially loading corrupt records.

## 4. Separate stage from status
Stage = position in the process; status = outcome. Prevents "reached Final Offer" from silently meaning "Selected". Selected requires the final stage; stage is locked once a candidate is Selected or Rejected.

## 5. Keep original field names and stage strings
`currentRound` and the six stage values come from the original data, so existing records stay valid. The report's five-stage wording is mapped, not forced onto the data.

## 6. Pure rule functions + thin components
`lib/applicants.js` has no React and is unit tested; the UI also relies on it, so rules cannot drift between UI and logic.

## 7. Vitest + Testing Library
Native to Vite, small footprint. Vitest 5 clears the `npm audit` findings that Vitest 3 had, at the cost of requiring Node 22.12+, so that is the stated requirement.

## 8. Relative Vite `base`
`base: './'` lets the same build run from a bucket root, a prefix (the report's bucket had an `RMS/` folder) or `vite preview`.

## 9. Removed Create React App leftovers
`logo.svg`, duplicated `App.css`/`index.css`, CRA manifest and React logo icons were unused boilerplate and were replaced by an SVG favicon.
