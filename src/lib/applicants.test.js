import { describe, it, expect } from 'vitest';
import { initialApplicants, initialCompanies } from '../data/data';
import {
  addApplicant, editApplicant, advanceApplicant, retreatApplicant, changeApplicantStatus,
  filterApplicants, sortApplicants, computeMetrics, stageCounts, validateApplicantInput, isValidApplicant,
} from './applicants';

const demo = () => initialApplicants.map((a) => ({ ...a }));
const byId = (list, id) => list.find((a) => a.id === id);

describe('filterApplicants', () => {
  it('filters by company only', () => {
    const r = filterApplicants(demo(), { company: 'Company B' });
    expect(r.every((a) => a.company === 'Company B')).toBe(true);
    expect(r.length).toBe(demo().filter((a) => a.company === 'Company B').length);
  });
  it('combines company and position', () => {
    const r = filterApplicants(demo(), { company: 'Company A', position: 'SDE' });
    expect(r.map((a) => a.name)).toEqual(expect.arrayContaining(['Aman Singh', 'Rohan Verma']));
    expect(r.every((a) => a.position === 'SDE' && a.company === 'Company A')).toBe(true);
  });
  it('does not return a position from another company', () => {
    expect(filterApplicants(demo(), { company: 'Company A', position: 'QA' })).toEqual([]);
  });
  it('searches name, email, stage and status together with filters', () => {
    const list = demo();
    expect(filterApplicants(list, { company: 'Company A', query: 'ROHAN' })).toHaveLength(1);
    expect(filterApplicants(list, { company: 'Company A', query: 'rohan.verma@' })).toHaveLength(1);
    expect(filterApplicants(list, { company: 'Company A', query: 'final offer' })).toHaveLength(1);
    expect(filterApplicants(list, { company: 'Company A', position: 'Intern', query: 'rohan' })).toHaveLength(0);
    expect(filterApplicants(list, { company: 'Company A', query: 'rejected' }).map((a) => a.name)).toEqual(['Karan Malhotra']);
  });
});

describe('sortApplicants', () => {
  it('sorts by name without mutating input', () => {
    const list = demo();
    const copy = [...list];
    const sorted = sortApplicants(list, 'name', 'desc');
    expect(list).toEqual(copy);
    expect(sorted[0].name >= sorted[1].name).toBe(true);
  });
  it('sorts by workflow order, not alphabetically, for stage', () => {
    const sorted = sortApplicants(demo(), 'currentRound', 'asc');
    expect(sorted[0].currentRound).toBe('Applied');
    expect(sorted[sorted.length - 1].currentRound).toBe('Final Offer');
  });
});

describe('stage transitions', () => {
  it('advances one stage at a time', () => {
    const r = advanceApplicant(demo(), 1);
    expect(r.ok).toBe(true);
    expect(byId(r.applicants, 1).currentRound).toBe('Coding Round');
  });
  it('does not mutate the original list', () => {
    const list = demo();
    advanceApplicant(list, 1);
    expect(byId(list, 1).currentRound).toBe('OA');
  });
  it('refuses to advance past the final stage', () => {
    const r = advanceApplicant(demo(), 11);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/last stage/);
  });
  it('refuses stage changes for Rejected or Selected candidates', () => {
    expect(advanceApplicant(demo(), 5).ok).toBe(false);
    expect(advanceApplicant(demo(), 4).ok).toBe(false);
    expect(retreatApplicant(demo(), 5).ok).toBe(false);
  });
  it('moves back one stage and stops at the first', () => {
    expect(byId(retreatApplicant(demo(), 1).applicants, 1).currentRound).toBe('Applied');
    expect(retreatApplicant(demo(), 2).ok).toBe(false);
  });
  it('reports unknown ids', () => {
    expect(advanceApplicant(demo(), 999).ok).toBe(false);
  });
});

describe('status changes', () => {
  it('only allows Selected at the final stage', () => {
    const r = changeApplicantStatus(demo(), 1, 'Selected');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Final Offer/);
    expect(changeApplicantStatus(demo(), 11, 'Selected').ok).toBe(true);
  });
  it('allows rejecting at any stage and reopening', () => {
    const rejected = changeApplicantStatus(demo(), 1, 'Rejected');
    expect(rejected.ok).toBe(true);
    const reopened = changeApplicantStatus(rejected.applicants, 1, 'In Process');
    expect(byId(reopened.applicants, 1).status).toBe('In Process');
  });
  it('does not jump Rejected -> Selected directly', () => {
    const list = changeApplicantStatus(demo(), 11, 'Rejected').applicants;
    expect(changeApplicantStatus(list, 11, 'Selected').ok).toBe(false);
  });
  it('rejects unknown and unchanged statuses', () => {
    expect(changeApplicantStatus(demo(), 1, 'Hired').ok).toBe(false);
    expect(changeApplicantStatus(demo(), 1, 'In Process').ok).toBe(false);
  });
});

describe('add and edit', () => {
  const valid = { name: '  Test Person ', email: 'Test.Person@example.com', company: 'Company A', position: 'Intern' };
  it('adds a candidate with a new id, Applied stage and In Process status', () => {
    const r = addApplicant(demo(), valid, initialCompanies);
    expect(r.ok).toBe(true);
    expect(r.applicant).toMatchObject({ id: 13, name: 'Test Person', currentRound: 'Applied', status: 'In Process' });
    expect(r.applicants).toHaveLength(13);
  });
  it('requires name, valid email, company and a position that belongs to the company', () => {
    const errors = validateApplicantInput({ name: '', email: 'nope', company: 'Company A', position: 'QA' }, { applicants: demo(), companies: initialCompanies });
    expect(errors.name).toBeDefined();
    expect(errors.email).toMatch(/valid email/);
    expect(errors.position).toMatch(/not a position/);
    expect(validateApplicantInput({ name: 'x', email: '', company: '', position: '' }, { applicants: [], companies: initialCompanies })).toMatchObject({ email: expect.any(String), company: expect.any(String), position: expect.any(String) });
  });
  it('detects duplicates by email (case-insensitive) within company and position', () => {
    const dup = addApplicant(demo(), { ...valid, email: 'ROHAN.VERMA@example.com', position: 'SDE' }, initialCompanies);
    expect(dup.ok).toBe(false);
    expect(dup.errors.email).toMatch(/already exists/);
    expect(addApplicant(demo(), { ...valid, email: 'rohan.verma@example.com', position: 'Intern' }, initialCompanies).ok).toBe(true);
  });
  it('edits only the chosen candidate and keeps stage, status and company', () => {
    const r = editApplicant(demo(), 3, { name: 'Rohan V.', email: 'rv@example.com', position: 'Intern' }, initialCompanies);
    expect(r.ok).toBe(true);
    expect(byId(r.applicants, 3)).toMatchObject({ name: 'Rohan V.', position: 'Intern', company: 'Company A', currentRound: 'Technical Interview' });
    expect(byId(r.applicants, 1).name).toBe('Aman Singh');
  });
  it('allows saving an edit without tripping duplicate detection on itself', () => {
    expect(editApplicant(demo(), 3, { name: 'Rohan Verma', email: 'rohan.verma@example.com', position: 'SDE' }, initialCompanies).ok).toBe(true);
  });
});

describe('metrics', () => {
  it('computes each metric from the records', () => {
    const m = computeMetrics(demo());
    expect(m.total).toBe(12);
    expect(m.selected).toBe(1);
    expect(m.rejected).toBe(2);
    expect(m.active).toBe(9);
    expect(m.total).toBe(m.active + m.selected + m.rejected);
    expect(m.assessment).toBe(3); // active ids 1 (OA), 7 (OA), 9 (Coding Round)
    expect(m.interview).toBe(3); // active ids 3 (Technical), 8 (HR), 10 (Technical)
  });
  it('scopes to company and does not double count', () => {
    const m = computeMetrics(filterApplicants(demo(), { company: 'Company A' }));
    expect(m).toEqual({ total: 7, active: 5, assessment: 2, interview: 2, selected: 1, rejected: 1 });
  });
  it('handles empty input', () => {
    expect(computeMetrics([])).toEqual({ total: 0, active: 0, assessment: 0, interview: 0, selected: 0, rejected: 0 });
  });
  it('stage counts sum to the list length', () => {
    expect(stageCounts(demo()).reduce((n, s) => n + s.count, 0)).toBe(12);
  });
});

describe('isValidApplicant', () => {
  it('accepts demo data and rejects bad records', () => {
    expect(demo().every((a) => isValidApplicant(a, initialCompanies))).toBe(true);
    expect(isValidApplicant({ ...demo()[0], currentRound: 'Hired' }, initialCompanies)).toBe(false);
    expect(isValidApplicant({ ...demo()[0], position: 'QA' }, initialCompanies)).toBe(false);
    expect(isValidApplicant(null, initialCompanies)).toBe(false);
  });
});
