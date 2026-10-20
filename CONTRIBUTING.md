# Contributing

Thanks for your interest. This is a small learning/portfolio project.

## Setup
Node.js 22.12+ and npm.
```bash
git clone https://github.com/yash-mehta13/Recruitment-Management-System.git
cd Recruitment-Management-System
npm install
npm run dev
```

## Workflow
1. Open or find an issue (bug report / feature request templates are provided).
2. Create a branch from `main`, e.g. `fix/csv-quotes` or `feat/delete-candidate`.
3. Make focused changes with clear commit messages.
4. Run `npm test` and `npm run build`; both must pass.
5. Open a pull request using the template.

## Expectations
- Match existing style; business rules go in `src/lib/` as pure functions with tests.
- Use the stage/status constants.
- Keep the UI accessible (labels, keyboard, contrast) and responsive.
- Use synthetic data only. Never commit secrets, credentials or real personal data.
- Update docs and `CHANGELOG.md` for user-visible changes, and keep claims accurate (frontend-only, browser storage).

## Reporting issues
Use the issue templates. For security problems follow [SECURITY.md](SECURITY.md) instead of opening a public issue with exploit details.
