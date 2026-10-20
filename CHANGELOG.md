# Changelog

All notable changes are recorded here. No versioned releases have been published.

## [Unreleased]

### Fixed
- Build produced an empty bundle: renamed `vit.config.js` to `vite.config.js`, added `type="module"` to the entry script, imported React/ReactDOM in `main.jsx`.
- Details form called hooks after an early return and kept an unused local state.
- Selecting a stage/status no longer allows invalid transitions (advance past the last stage, Selected before Final Offer).
- CSV export now escapes quotes, commas and newlines and neutralises spreadsheet formulas.

### Added
- Dashboard metrics and per-stage overview; position chips, search, sorting, empty states.
- Candidate detail panel with stage tracker; add and edit candidate forms with validation and duplicate detection.
- `localStorage` persistence (`rms.applicants.v1`) and Reset to demo data.
- Synthetic demo candidates (ids 3–12; original records 1–2 unchanged).
- Vitest + React Testing Library test suite.
- README, `docs/`, CLAUDE.md, CONTRIBUTING.md, SECURITY.md, issue and PR templates.

### Changed
- Redesigned UI (responsive, accessible controls) in a single stylesheet; componentised `src/`.
- `package.json`: project name/metadata, `engines`, test scripts. Dependencies added for testing only.
- CSV columns now use readable headers and an added header/BOM/CRLF format; file name includes company, position and date.
- `.gitignore` extended for Vite/Node artifacts.

### Removed
- Create React App leftovers: `logo.svg`, duplicate `App.css`/`index.css`, CRA manifest/icons/favicon, and the old component files replaced by the new ones.
