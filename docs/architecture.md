# Architecture

RMS is a single-page React 18 application built with Vite 7 into static files. Nothing runs on a server.

```
 index.html ─▶ src/main.jsx ─▶ App.jsx
                                 │ state: company, position, query, sort, selection, form mode, feedback
                                 │
        useApplicants() ◀────────┤   (hook: applicant list)
          │  React state         │
          │  lib/storage.js ─────┼──▶ window.localStorage["rms.applicants.v1"]
          │  lib/applicants.js   │   pure functions: filter / sort / metrics / transitions / validation
                                 │
                                 ├─▶ MetricsGrid, Toolbar, ApplicantTable, ApplicantDetails / ApplicantForm
                                 └─▶ lib/csv.js ─▶ Blob download
```

## Modules
| Path | Responsibility |
| --- | --- |
| `src/constants.js` | Stage list, status values, metric stage groups, storage key/version |
| `src/data/data.js` | Synthetic companies and candidates (demo seed) |
| `src/lib/applicants.js` | Pure rules. Operations return `{ ok, applicants, applicant }` or `{ ok:false, error(s) }` and never mutate input |
| `src/lib/storage.js` | Load/validate/save/clear `localStorage`; falls back to demo data |
| `src/lib/csv.js` | CSV cell escaping, formula-injection guard, filename, download |
| `src/hooks/useApplicants.js` | Holds the list in state, saves each change, exposes operations |
| `src/components/*` | Presentation only; receive data and callbacks |

## Data flow
1. On load, `loadApplicants` reads storage; invalid/missing data falls back to demo data.
2. `App` derives `scoped` (company + position) for metrics, and `visible` (scoped + search, sorted) for the table and export.
3. A user action calls a hook operation → pure function → new list in state → effect writes to `localStorage`.
4. Feedback (success/error) appears in a `role="status"` live region.

## Filters
Company selection resets the position filter and closes the detail/form. Metrics and the stage chart use company + position; **search only narrows the table and export**, so metrics do not jump while typing.

## Stage and status updates
Rules live in `lib/applicants.js` (see [data-model.md](data-model.md)). The UI disables unavailable actions and explains why; the functions also reject invalid requests, so rules do not depend on the UI.

## CSV export
`toCsv(visible)` → `downloadCsv` creates a Blob URL and clicks a temporary link. See [features-and-workflows.md](features-and-workflows.md#csv-export).

## Persistence
Browser `localStorage` only. Not a backend; see [security-and-privacy.md](security-and-privacy.md) and [decisions.md](decisions.md).

## Build output
`vite build` writes `dist/` (`index.html`, `assets/*.js|css`, `favicon.svg`, `robots.txt`) using relative asset paths (`base: './'`).
