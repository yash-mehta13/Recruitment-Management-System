# Testing

## Run
```bash
npm test            # one-off run (Vitest, jsdom)
npm run test:watch
npm run build       # also confirms the app bundles
```
Requires Node 22.12+ (Vitest 5).

## What exists
| File | Covers |
| --- | --- |
| `src/lib/applicants.test.js` | Filters (alone and combined with search), sorting, stage and status transitions incl. invalid ones, add/edit/duplicate validation, metric definitions, record validation |
| `src/lib/csv.test.js` | Headers, quote doubling, commas/newlines, formula-injection prefixes, CRLF, filename |
| `src/lib/storage.test.js` | Fallback on missing/corrupt/old/invalid data, round trip, clear, write failure |
| `src/App.test.jsx` | UI flows: company/position filters and metrics, search + empty state, select → advance → persists across remount, no stale form values when switching candidates, blocked Selected, add with validation, reset, CSV contents match visible rows, export disabled when empty |

## Manual browser checks (Chromium via Playwright; script not committed)
Run against `vite preview`: no console errors or warnings on load and during interaction, persistence after reload, no horizontal page overflow at 820 px and 390 px widths. The screenshots in `docs/screenshots/` come from this run.

## Gaps
- No committed end-to-end browser tests and no CI workflow.
- No automated accessibility audit (axe); accessibility is checked only through role/label queries in tests and a manual keyboard sanity check.
- No linter configured.
- The file download is stubbed in tests (Blob content is checked, no file is saved).
- No visual regression testing.
