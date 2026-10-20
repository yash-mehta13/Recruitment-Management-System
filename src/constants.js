// Single source of truth for the recruitment vocabulary.
// Stage values are the strings already used by the original demo data.

export const STAGES = [
  'Applied',
  'OA',
  'Coding Round',
  'Technical Interview',
  'HR',
  'Final Offer',
];

export const STAGE_DESCRIPTIONS = {
  Applied: 'Application received',
  OA: 'Online assessment',
  'Coding Round': 'Live or take-home coding round',
  'Technical Interview': 'Technical interview',
  HR: 'HR interview',
  'Final Offer': 'Offer stage; the candidate can now be marked Selected',
};

export const STATUS = {
  IN_PROCESS: 'In Process',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
};

export const STATUSES = [STATUS.IN_PROCESS, STATUS.SELECTED, STATUS.REJECTED];

export const FINAL_STAGE = STAGES[STAGES.length - 1];

// Stage groups used by the dashboard metrics (only for candidates In Process).
export const ASSESSMENT_STAGES = ['OA', 'Coding Round'];
export const INTERVIEW_STAGES = ['Technical Interview', 'HR'];

export const STORAGE_KEY = 'rms.applicants.v1';
export const STORAGE_VERSION = 1;
