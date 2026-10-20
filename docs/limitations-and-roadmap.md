# Limitations and roadmap

## Known limitations
- No backend, database or API; persistence is per-browser `localStorage`.
- No authentication or authorization; no audit history.
- No multi-user synchronization; two people see different data.
- Companies and positions are fixed in code; candidates cannot be deleted; no import.
- Stage names are fixed; report's "Shortlisted" has no dedicated stage ([mapping](features-and-workflows.md#stage-vocabulary-and-the-report)).
- No automated end-to-end tests, CI, linter or accessibility audit.
- The original S3 deployment no longer exists; there is no live demo.
- No license has been chosen.

## Roadmap (all **not done**)
| Item | Notes |
| --- | --- |
| Backend + database | e.g. an API with a managed database; replace `useApplicants` storage layer |
| Authentication and roles | Recruiter / hiring manager / admin |
| Server-side persistence and sync | Shared records across users and devices |
| Protected candidate records | Access control, encryption, retention |
| Audit history | Who changed which stage/status and when |
| Analytics | Time-in-stage, conversion by stage |
| Delete/archive, import, editable companies/positions | |
| Quality | CI running `npm test` and `npm run build`, linting, axe checks, Playwright tests |
| Deployment | CloudFront + private S3 with OAC, infrastructure as code |

## Completed in this change
Persistence in the browser, add/edit candidates, validated transitions, dashboard metrics, CSV hardening, unit and component tests.
