import { useCallback, useEffect, useRef, useState } from 'react';
import { initialApplicants, initialCompanies } from '../data/data';
import {
  addApplicant,
  editApplicant,
  advanceApplicant,
  retreatApplicant,
  changeApplicantStatus,
} from '../lib/applicants';
import { loadApplicants, saveApplicants, clearSavedApplicants } from '../lib/storage';

/**
 * Owns the applicant list. State lives in React; changes are mirrored to this
 * browser's localStorage. There is no server: data never leaves the browser.
 */
export function useApplicants() {
  const [initial] = useState(() => loadApplicants(initialApplicants, initialCompanies));
  const [applicants, setApplicants] = useState(initial.applicants);
  const [storageNotice, setStorageNotice] = useState(initial.notice);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!saveApplicants(applicants)) {
      setStorageNotice('Could not save to browser storage; changes will be lost on refresh.');
    }
  }, [applicants]);

  // Applies a pure operation to the current list; returns its result for UI feedback.
  const apply = useCallback(
    (operation) => {
      const result = operation(applicants);
      if (result.ok) setApplicants(result.applicants);
      return result;
    },
    [applicants]
  );

  return {
    applicants,
    storageNotice,
    dismissStorageNotice: () => setStorageNotice(null),
    add: (input) => apply((list) => addApplicant(list, input, initialCompanies)),
    edit: (id, input) => apply((list) => editApplicant(list, id, input, initialCompanies)),
    advance: (id) => apply((list) => advanceApplicant(list, id)),
    retreat: (id) => apply((list) => retreatApplicant(list, id)),
    setStatus: (id, status) => apply((list) => changeApplicantStatus(list, id, status)),
    resetToDemo: () => {
      clearSavedApplicants();
      setApplicants(initialApplicants);
      setStorageNotice(null);
    },
  };
}
