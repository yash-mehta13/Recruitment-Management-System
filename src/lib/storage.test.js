import { describe, it, expect, vi } from 'vitest';
import { initialApplicants, initialCompanies } from '../data/data';
import { STORAGE_KEY } from '../constants';
import { loadApplicants, saveApplicants, clearSavedApplicants } from './storage';

const load = () => loadApplicants(initialApplicants, initialCompanies);

describe('storage', () => {
  it('returns demo data when nothing is saved', () => {
    expect(load()).toMatchObject({ source: 'demo', notice: null });
  });
  it('round-trips saved applicants', () => {
    const changed = initialApplicants.map((a) => (a.id === 1 ? { ...a, currentRound: 'HR' } : a));
    expect(saveApplicants(changed)).toBe(true);
    const r = load();
    expect(r.source).toBe('storage');
    expect(r.applicants.find((a) => a.id === 1).currentRound).toBe('HR');
  });
  it('falls back on corrupt JSON with a notice', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(load()).toMatchObject({ source: 'demo', applicants: initialApplicants });
    expect(load().notice).toMatch(/could not be read/);
  });
  it('falls back on a different version', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 0, applicants: initialApplicants }));
    expect(load().source).toBe('demo');
  });
  it('falls back when any record is invalid or ids repeat', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, applicants: [{ ...initialApplicants[0], status: 'Hired' }] }));
    expect(load().source).toBe('demo');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, applicants: [initialApplicants[0], initialApplicants[0]] }));
    expect(load().source).toBe('demo');
  });
  it('clears saved data', () => {
    saveApplicants(initialApplicants);
    clearSavedApplicants();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it('reports failure when storage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    expect(saveApplicants(initialApplicants)).toBe(false);
    spy.mockRestore();
  });
});
