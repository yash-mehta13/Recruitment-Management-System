# Security policy

## Scope
RMS is a frontend-only demo with synthetic data. It has no backend, authentication or server-side storage, so the usual server vulnerabilities do not apply, but client-side issues (for example XSS, unsafe CSV output, vulnerable dependencies) are relevant.

## Reporting a vulnerability
There is no dedicated security mailbox or formal vulnerability-management process. Please use GitHub's **private vulnerability reporting** (Security tab → "Report a vulnerability") if the repository owner has enabled it; otherwise contact the repository owner [@yash-mehta13](https://github.com/yash-mehta13) via their GitHub profile and avoid posting exploit details in a public issue. Reports are handled on a best-effort basis.

## Known limitations (not vulnerabilities)
- No authentication or authorization; client-side rules are not access control.
- Data in `localStorage` is unencrypted and editable by the user.
- Do not put real candidate data in a publicly hosted copy.

See [docs/security-and-privacy.md](docs/security-and-privacy.md).
