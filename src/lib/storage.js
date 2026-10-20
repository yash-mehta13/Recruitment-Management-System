import { STORAGE_KEY, STORAGE_VERSION } from '../constants';
import { isValidApplicant } from './applicants';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null; // blocked (private mode, disabled site data)
  }
}

/**
 * Loads applicants from this browser's localStorage.
 * Returns { applicants, source, notice } where source is 'storage' or 'demo'.
 * Anything missing, unparsable, outdated or invalid falls back to the demo data.
 */
export function loadApplicants(demoApplicants, companies) {
  const storage = getStorage();
  const fallback = (notice = null) => ({ applicants: demoApplicants, source: 'demo', notice });
  if (!storage) return fallback('Browser storage is unavailable; changes will not be saved.');

  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return fallback('Browser storage is unavailable; changes will not be saved.');
  }
  if (raw === null) return fallback();

  try {
    const data = JSON.parse(raw);
    const ids = new Set();
    const valid =
      data &&
      data.version === STORAGE_VERSION &&
      Array.isArray(data.applicants) &&
      data.applicants.every((a) => {
        if (!isValidApplicant(a, companies) || ids.has(a.id)) return false;
        ids.add(a.id);
        return true;
      });
    if (!valid) return fallback('Saved data was invalid or outdated, so the demo data was restored.');
    return { applicants: data.applicants, source: 'storage', notice: null };
  } catch {
    return fallback('Saved data could not be read, so the demo data was restored.');
  }
}

/** Returns true on success. */
export function saveApplicants(applicants) {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, applicants }));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedApplicants() {
  const storage = getStorage();
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}
