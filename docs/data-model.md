# Data model

## Company
```js
{ name: 'Company A', positions: ['SDE', 'Intern', 'Manager'] }
```
Defined in `src/data/data.js`; fixed at build time. The company name is its key.

## Applicant
```js
{
  id: 3,                               // integer, unique, never reused (next id = max + 1; no deletion)
  name: 'Rohan Verma',                 // required, ≤ 80 chars
  company: 'Company A',                // must be a known company
  position: 'SDE',                     // must belong to that company
  email: 'rohan.verma@example.com',    // required in the forms, valid format, ≤ 120 chars
  currentRound: 'Technical Interview', // one of the stages (original field name, shown as "Stage")
  status: 'In Process'                 // one of the statuses
}
```

## Vocabulary
- **Stages (ordered):** Applied, OA, Coding Round, Technical Interview, HR, Final Offer
- **Statuses:** In Process, Selected, Rejected

## Validation
- **Forms:** name and email required, email format, company/position consistency, duplicate check (email + company + position, case-insensitive).
- **Storage load:** whole-document check. Version must be `1`; every record needs a unique integer id, non-empty name, string email, known company, a position of that company, a known stage and a known status. Any failure restores demo data and shows a notice.
- **Transitions:** see [features-and-workflows.md](features-and-workflows.md#transition-rules).

## Persistence format
`localStorage["rms.applicants.v1"] = { "version": 1, "applicants": [ … ] }`. Only applicants are stored; filters and selection are not. A future schema change should bump `STORAGE_VERSION` and the key; old data then falls back to demo data unless a migration is written.

Original seed records (ids 1 and 2) are unchanged; ids 3–12 are synthetic additions.
