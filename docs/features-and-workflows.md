# Features and workflows

## Implemented
| Feature | Notes |
| --- | --- |
| Company tabs | Switching resets position filter and selection; tab shows candidate count |
| Position filter | Buttons for the company's positions plus "All positions" |
| Search | Case-insensitive across name, email, position, stage, status |
| Sort | Name, position, stage (workflow order), status; ascending/descending |
| Metrics | See definitions below |
| Details panel | Email, stage, status, stage tracker |
| Stage change | Advance one stage / move back one stage |
| Status change | In Process, Selected, Rejected under the rules below |
| Add / edit candidate | Edit changes name, email, position (company, stage, status are not editable in the form) |
| CSV export | Visible rows |
| Persistence / reset | Browser only |

## Planned (not implemented)
Delete/archive candidates, editing companies/positions, notes and history, authentication, shared storage. See [limitations-and-roadmap.md](limitations-and-roadmap.md).

## Metric definitions
Scope = selected company + position filter (not search). Each candidate has one status, so `total = active + selected + rejected`.

| Metric | Definition |
| --- | --- |
| Total | Candidates in scope |
| Active | Status In Process |
| In assessment | Active and stage OA or Coding Round |
| In interviews | Active and stage Technical Interview or HR |
| Selected / Rejected | Status equals Selected / Rejected |

"In assessment" and "In interviews" are subsets of Active (Applied and Final Offer candidates are active but in neither).

## Workflows
- **Review a pipeline:** pick a company → choose a position (optional) → search → read the metrics and table.
- **Progress a candidate:** "View / Update" → "Advance to …" until Final Offer → set status **Selected** (or **Rejected** at any point).
- **Reopen:** a Rejected or Selected candidate can be reopened (*In Process*); stage is locked until then.
- **Add:** "Add candidate" → fill the form → the candidate starts at *Applied / In Process* and is selected in the list.
- **Export:** set filters → "Export CSV".

## Transition rules
- Stage can change only while status is In Process; no advancing past *Final Offer* or back before *Applied*.
- Selected requires stage *Final Offer*. Rejected → Selected directly is not allowed (reopen first).
- Duplicate = same email (case-insensitive) with the same company and position.

## Stage vocabulary and the report
The October 2025 report describes the stages *Applied, Shortlisted, Online Assessment, Interview, Selected*. The code uses six stages plus a separate status. The mapping is conceptual; the app has no "Shortlisted" stage.

| Report term | In the app |
| --- | --- |
| Applied | Stage `Applied` |
| Shortlisted | No dedicated stage; a candidate who passes screening moves from `Applied` to `OA` |
| Online Assessment | Stages `OA`, `Coding Round` |
| Interview | Stages `Technical Interview`, `HR` |
| Selected | Status `Selected` (only at stage `Final Offer`) |

## CSV export
Exports the rows in the table (company, position, search, sort order). Columns: Name, Company, Position, Email, Current Stage, Status. Every cell is quoted, `"` is doubled, commas/newlines stay inside the cell, lines end in CRLF, a UTF-8 BOM is added for Excel, and cells starting with `= + - @ TAB CR` get a leading `'`. Empty result → button disabled.
