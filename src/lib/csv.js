export const CSV_COLUMNS = [
  { header: 'Name', value: (a) => a.name },
  { header: 'Company', value: (a) => a.company },
  { header: 'Position', value: (a) => a.position },
  { header: 'Email', value: (a) => a.email },
  { header: 'Current Stage', value: (a) => a.currentRound },
  { header: 'Status', value: (a) => a.status },
];

// Characters that make spreadsheet apps evaluate a cell as a formula.
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;

/**
 * Converts one value to a CSV cell:
 *  1. neutralises formula injection by prefixing a single quote,
 *  2. doubles embedded quotes,
 *  3. always wraps in quotes (so commas and newlines are safe).
 */
export function toCsvCell(value) {
  let text = String(value ?? '');
  if (FORMULA_TRIGGER.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** RFC 4180 style CSV (CRLF line endings), header row first. */
export function toCsv(applicants, columns = CSV_COLUMNS) {
  const lines = [
    columns.map((c) => toCsvCell(c.header)).join(','),
    ...applicants.map((a) => columns.map((c) => toCsvCell(c.value(a))).join(',')),
  ];
  return lines.join('\r\n') + '\r\n';
}

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function buildExportFilename({ company, position, date = new Date() }) {
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const parts = ['rms-applicants', slug(company), position && position !== 'All' ? slug(position) : 'all-positions', stamp];
  return `${parts.filter(Boolean).join('_')}.csv`;
}

/** Triggers a browser download. A BOM is added so Excel reads UTF-8 correctly. */
export function downloadCsv(csvText, filename) {
  const blob = new Blob(['﻿', csvText], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
