# CLAUDE.md

Guidance for Claude Code sessions in this repository.

## What this is
Frontend-only Recruitment Management System: React 18 + Vite 7. No backend, no auth. Data is synthetic and persisted in browser `localStorage` (`rms.applicants.v1`). Do not describe it as anything more.

## Commands
```bash
npm install
npm run dev        # dev server
npm run build      # output: dist/
npm run preview
npm test           # Vitest + Testing Library (Node 22.12+)
```

## Layout
- `src/constants.js` stages, statuses, storage key
- `src/lib/applicants.js` pure rules (filter, sort, metrics, transitions, validation) — put business logic here
- `src/lib/csv.js`, `src/lib/storage.js`
- `src/hooks/useApplicants.js` state + persistence
- `src/components/` presentation; `src/App.jsx` composition
- `src/data/data.js` demo data (ids 1–2 are the original records)
- `docs/` documentation; `docs/screenshots/` real captures only

## Conventions
- Never mutate state; lib functions return `{ ok, ... }` results.
- Use constants for stages/statuses, never repeat strings.
- Plain CSS in `src/styles/main.css` using the `:root` tokens; no inline styling for layout.
- Every control needs an accessible name; keep keyboard operability.
- Add or update tests for any logic change; run `npm test` and `npm run build` before finishing.

## Security rules
- No real candidate data, secrets, `.env` files or AWS credentials in the repo, docs or screenshots.
- Keep CSV formula-injection protection when touching export.
- Do not claim authentication, a backend, shared data or a live deployment exists.
- Don't deploy, push or change AWS/GitHub settings without the owner's explicit approval.

## Documentation rule
Verify against the code (and run it) before editing docs. The historical S3 URL is offline (`NoSuchBucket` as of 2026-10-20); do not present it as a live demo. Report facts (bucket, region) are historical.
