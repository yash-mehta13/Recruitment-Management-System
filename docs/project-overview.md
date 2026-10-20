# Project overview

## Purpose
RMS gives a recruiter a single screen to see candidates for a company, filter them by position, move them through the hiring stages, record outcomes, and export a list for offline review. It began as an academic cloud-computing project (VIT Vellore, October 2025) whose focus was hosting a React application on Amazon S3.

## Intended users
Recruiters / HR coordinators, in a demo or learning context. It is a portfolio and teaching project, not a production hiring system.

## What works today
- Dashboard metrics, company tabs, position filters, search, sorting.
- Candidate detail view with stage tracker, stage advance/back, status changes.
- Add / edit candidate with validation and duplicate detection.
- CSV export of the visible candidates.
- Browser-local persistence and reset to demo data.

## Report use cases and their status

| Use case in the October 2025 report | Status in this repository |
| --- | --- |
| HR dashboard | Implemented (metrics and pipeline overview for the selected company/position) |
| Candidate tracking | Implemented with the app's six stages (see [mapping](features-and-workflows.md#stage-vocabulary-and-the-report)) |
| Data export (CSV) | Implemented |
| Remote access via browser | Possible by hosting the static build; the original S3 site no longer exists |
| "Real-time updates", access to shared records from anywhere | **Not implemented.** Data is per-browser; there is no backend |
| Posting job openings, integration with other HR tools | **Not implemented** |

## Out of scope
Authentication, roles, server-side storage, multi-user sync, resume handling, email, scheduling. See [limitations-and-roadmap.md](limitations-and-roadmap.md).
