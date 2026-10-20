import { STAGES, STATUS, STATUSES, FINAL_STAGE, ASSESSMENT_STAGES, INTERVIEW_STAGES } from '../constants';

// All functions here are pure: they never mutate their arguments.
// Operations return { ok: true, applicants, applicant } or { ok: false, error }.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize = (value) => String(value ?? '').trim();
const sameEmail = (a, b) => normalize(a).toLowerCase() === normalize(b).toLowerCase();

/** Structural check used when loading persisted data. */
export function isValidApplicant(record, companies) {
  if (!record || typeof record !== 'object') return false;
  const { id, name, company, position, email, currentRound, status } = record;
  const co = companies.find((c) => c.name === company);
  return (
    Number.isInteger(id) &&
    typeof name === 'string' && name.trim() !== '' &&
    typeof email === 'string' &&
    Boolean(co) &&
    co.positions.includes(position) &&
    STAGES.includes(currentRound) &&
    STATUSES.includes(status)
  );
}

/** Validates form input. Returns an object of field -> message (empty when valid). */
export function validateApplicantInput(input, { applicants, companies, ignoreId = null }) {
  const errors = {};
  const name = normalize(input.name);
  const email = normalize(input.email);
  const company = companies.find((c) => c.name === input.company);

  if (!name) errors.name = 'Enter the candidate’s name.';
  else if (name.length > 80) errors.name = 'Name must be 80 characters or fewer.';

  if (!email) errors.email = 'Enter an email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address, e.g. name@example.com.';
  else if (email.length > 120) errors.email = 'Email must be 120 characters or fewer.';

  if (!company) errors.company = 'Choose a company.';
  if (!input.position) errors.position = 'Choose a position.';
  else if (company && !company.positions.includes(input.position)) {
    errors.position = `${input.position} is not a position at ${company.name}.`;
  }

  if (!errors.email && !errors.company && !errors.position) {
    const duplicate = applicants.some(
      (a) =>
        a.id !== ignoreId &&
        a.company === input.company &&
        a.position === input.position &&
        sameEmail(a.email, email)
    );
    if (duplicate) errors.email = 'A candidate with this email already exists for this company and position.';
  }
  return errors;
}

export function nextApplicantId(applicants) {
  return applicants.reduce((max, a) => Math.max(max, a.id), 0) + 1;
}

export function addApplicant(applicants, input, companies) {
  const errors = validateApplicantInput(input, { applicants, companies });
  if (Object.keys(errors).length) return { ok: false, errors, error: 'Please fix the highlighted fields.' };
  const applicant = {
    id: nextApplicantId(applicants),
    name: normalize(input.name),
    company: input.company,
    position: input.position,
    email: normalize(input.email),
    currentRound: STAGES[0],
    status: STATUS.IN_PROCESS,
  };
  return { ok: true, applicants: [...applicants, applicant], applicant };
}

/** Edits name, email and position. Company, stage and status are not editable here. */
export function editApplicant(applicants, id, input, companies) {
  const existing = applicants.find((a) => a.id === id);
  if (!existing) return { ok: false, error: 'That candidate no longer exists.' };
  const merged = { ...input, company: existing.company };
  const errors = validateApplicantInput(merged, { applicants, companies, ignoreId: id });
  if (Object.keys(errors).length) return { ok: false, errors, error: 'Please fix the highlighted fields.' };
  const applicant = {
    ...existing,
    name: normalize(input.name),
    email: normalize(input.email),
    position: input.position,
  };
  return { ok: true, applicants: applicants.map((a) => (a.id === id ? applicant : a)), applicant };
}

const replace = (applicants, applicant) => applicants.map((a) => (a.id === applicant.id ? applicant : a));

export function advanceApplicant(applicants, id) {
  const a = applicants.find((x) => x.id === id);
  if (!a) return { ok: false, error: 'That candidate no longer exists.' };
  if (a.status !== STATUS.IN_PROCESS) {
    return { ok: false, error: `Stage cannot change while the candidate is ${a.status}. Set status to In Process first.` };
  }
  const index = STAGES.indexOf(a.currentRound);
  if (index === STAGES.length - 1) {
    return { ok: false, error: `${a.name} is already at the last stage (${FINAL_STAGE}). Mark them Selected or Rejected.` };
  }
  const updated = { ...a, currentRound: STAGES[index + 1] };
  return { ok: true, applicants: replace(applicants, updated), applicant: updated };
}

export function retreatApplicant(applicants, id) {
  const a = applicants.find((x) => x.id === id);
  if (!a) return { ok: false, error: 'That candidate no longer exists.' };
  if (a.status !== STATUS.IN_PROCESS) {
    return { ok: false, error: `Stage cannot change while the candidate is ${a.status}. Set status to In Process first.` };
  }
  const index = STAGES.indexOf(a.currentRound);
  if (index === 0) return { ok: false, error: `${a.name} is already at the first stage (${STAGES[0]}).` };
  const updated = { ...a, currentRound: STAGES[index - 1] };
  return { ok: true, applicants: replace(applicants, updated), applicant: updated };
}

// Allowed status changes. Selected additionally requires the final stage.
const STATUS_TRANSITIONS = {
  [STATUS.IN_PROCESS]: [STATUS.SELECTED, STATUS.REJECTED],
  [STATUS.SELECTED]: [STATUS.IN_PROCESS, STATUS.REJECTED],
  [STATUS.REJECTED]: [STATUS.IN_PROCESS],
};

/** Returns an explanation if the change is not allowed, otherwise null. */
export function getStatusChangeError(applicant, nextStatus) {
  if (!STATUSES.includes(nextStatus)) return `Unknown status "${nextStatus}".`;
  if (applicant.status === nextStatus) return `Status is already ${nextStatus}.`;
  if (!STATUS_TRANSITIONS[applicant.status].includes(nextStatus)) {
    return `A ${applicant.status} candidate cannot be set directly to ${nextStatus}. Reopen them as In Process first.`;
  }
  if (nextStatus === STATUS.SELECTED && applicant.currentRound !== FINAL_STAGE) {
    return `Only candidates at the ${FINAL_STAGE} stage can be marked Selected.`;
  }
  return null;
}

export function changeApplicantStatus(applicants, id, nextStatus) {
  const a = applicants.find((x) => x.id === id);
  if (!a) return { ok: false, error: 'That candidate no longer exists.' };
  const error = getStatusChangeError(a, nextStatus);
  if (error) return { ok: false, error };
  const updated = { ...a, status: nextStatus };
  return { ok: true, applicants: replace(applicants, updated), applicant: updated };
}

/** Company + position + free-text search. Search covers name, email, position, stage and status. */
export function filterApplicants(applicants, { company, position = 'All', query = '' }) {
  const q = normalize(query).toLowerCase();
  return applicants.filter((a) => {
    if (company && a.company !== company) return false;
    if (position !== 'All' && a.position !== position) return false;
    if (!q) return true;
    return [a.name, a.email, a.position, a.currentRound, a.status].some((v) =>
      String(v ?? '').toLowerCase().includes(q)
    );
  });
}

export const SORT_KEYS = ['name', 'position', 'currentRound', 'status'];

export function sortApplicants(applicants, key = 'name', direction = 'asc') {
  const factor = direction === 'desc' ? -1 : 1;
  const value = (a) => (key === 'currentRound' ? STAGES.indexOf(a.currentRound) : String(a[key] ?? '').toLowerCase());
  return [...applicants].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    let result = va < vb ? -1 : va > vb ? 1 : 0;
    if (result === 0) result = a.name.localeCompare(b.name) || a.id - b.id;
    else result *= factor;
    return result;
  });
}

/**
 * Dashboard metrics. Definitions (each candidate has exactly one status):
 *  total      every candidate in scope
 *  active     status In Process
 *  assessment active and at OA or Coding Round
 *  interview  active and at Technical Interview or HR
 *  selected   status Selected
 *  rejected   status Rejected
 * total = active + selected + rejected. assessment and interview are subsets of active.
 */
export function computeMetrics(applicants) {
  const active = applicants.filter((a) => a.status === STATUS.IN_PROCESS);
  return {
    total: applicants.length,
    active: active.length,
    assessment: active.filter((a) => ASSESSMENT_STAGES.includes(a.currentRound)).length,
    interview: active.filter((a) => INTERVIEW_STAGES.includes(a.currentRound)).length,
    selected: applicants.filter((a) => a.status === STATUS.SELECTED).length,
    rejected: applicants.filter((a) => a.status === STATUS.REJECTED).length,
  };
}

/** Number of candidates at each stage (any status), in workflow order. */
export function stageCounts(applicants) {
  return STAGES.map((stage) => ({
    stage,
    count: applicants.filter((a) => a.currentRound === stage).length,
  }));
}
