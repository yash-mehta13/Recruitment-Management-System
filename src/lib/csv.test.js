import { describe, it, expect } from 'vitest';
import { toCsv, toCsvCell, buildExportFilename, CSV_COLUMNS } from './csv';

describe('toCsvCell', () => {
  it('quotes values and doubles embedded quotes', () => {
    expect(toCsvCell('He said "hi"')).toBe('"He said ""hi"""');
  });
  it('keeps commas and newlines inside the quoted cell', () => {
    expect(toCsvCell('a,b\nc')).toBe('"a,b\nc"');
  });
  it.each(['=1+1', '+SUM(A1)', '-2+3', '@cmd', '\tTAB', '\rCR'])('neutralises formula trigger %j', (v) => {
    expect(toCsvCell(v).startsWith(`"'`)).toBe(true);
  });
  it('does not alter ordinary values or mid-string symbols', () => {
    expect(toCsvCell('Anne-Marie = ok')).toBe('"Anne-Marie = ok"');
  });
  it('treats null and undefined as empty', () => {
    expect(toCsvCell(null)).toBe('""');
    expect(toCsvCell(undefined)).toBe('""');
  });
});

describe('toCsv', () => {
  const row = { id: 1, name: 'Ada "A" Lovelace', company: 'Company A', position: 'SDE', email: '=cmd@example.com', currentRound: 'OA', status: 'In Process' };
  it('writes a header row with readable column names', () => {
    const [header] = toCsv([]).split('\r\n');
    expect(header).toBe('"Name","Company","Position","Email","Current Stage","Status"');
  });
  it('writes one CRLF-terminated line per applicant with escaping', () => {
    const csv = toCsv([row]);
    expect(csv.endsWith('\r\n')).toBe(true);
    expect(csv.split('\r\n')[1]).toBe('"Ada ""A"" Lovelace","Company A","SDE","\'=cmd@example.com","OA","In Process"');
  });
  it('has one value per column', () => {
    expect(CSV_COLUMNS).toHaveLength(6);
  });
});

describe('buildExportFilename', () => {
  it('includes company, position and date', () => {
    const d = new Date(2026, 0, 5);
    expect(buildExportFilename({ company: 'Company A', position: 'SDE', date: d })).toBe('rms-applicants_company-a_sde_2026-01-05.csv');
    expect(buildExportFilename({ company: 'Company B', position: 'All', date: d })).toBe('rms-applicants_company-b_all-positions_2026-01-05.csv');
  });
});
