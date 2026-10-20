import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { STORAGE_KEY } from './constants';

const metric = (name) => screen.getByTestId(`metric-${name}`).textContent;
const rows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1);
const names = () => rows().map((r) => within(r).getAllByRole('rowheader')[0].textContent);

describe('App', () => {
  it('shows Company A candidates and metrics that match the table', () => {
    render(<App />);
    expect(names()).toHaveLength(7);
    expect(metric('total')).toBe('7');
    expect(screen.getByTestId('result-summary')).toHaveTextContent('Showing 7 of 7');
  });

  it('switching company and position updates table and metrics', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Company B/ }));
    expect(names()).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Research' }));
    expect(names().sort()).toEqual(['Farhan Sheikh', 'Lakshmi Pillai']);
    expect(metric('total')).toBe('2');
    expect(metric('interview')).toBe('1');
  });

  it('search combines with filters and shows an empty state with a way out', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Intern' }));
    await user.type(screen.getByLabelText('Search candidates'), 'rohan');
    expect(screen.getByText('No candidates match.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Clear search and position filter/ }));
    expect(names()).toHaveLength(7);
  });

  it('selects an applicant, advances the stage, and persists across remount', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(screen.getByRole('button', { name: 'View details for Aman Singh' }));
    const details = screen.getByRole('complementary');
    expect(within(details).getByRole('heading', { name: 'Aman Singh' })).toBeInTheDocument();
    await user.click(within(details).getByRole('button', { name: /Advance to Coding Round/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Aman Singh moved to Coding Round');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).applicants.find((a) => a.id === 1).currentRound).toBe('Coding Round');
    unmount();
    render(<App />);
    expect(within(rows().find((r) => within(r).queryByText('Aman Singh'))).getByText('Coding Round')).toBeInTheDocument();
  });

  it('switching applicants never shows stale data', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'View details for Aman Singh' }));
    await user.click(screen.getByRole('button', { name: 'Edit candidate' }));
    expect(screen.getByLabelText('Name')).toHaveValue('Aman Singh');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'View details for Rohan Verma' }));
    await user.click(screen.getByRole('button', { name: 'Edit candidate' }));
    expect(screen.getByLabelText('Name')).toHaveValue('Rohan Verma');
  });

  it('blocks Selected before the final stage and allows it at the final stage', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'View details for Aman Singh' }));
    expect(screen.getByRole('button', { name: 'Selected' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Rejected' }));
    expect(screen.getByRole('status')).toHaveTextContent('Aman Singh is now Rejected');
    expect(metric('rejected')).toBe('2');
    expect(screen.getByRole('button', { name: /Advance to/ })).toBeDisabled();
  });

  it('validates and adds a candidate end to end', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Add candidate' }));
    const form = () => screen.getByRole('form', { name: 'Add candidate' });
    await user.click(within(form()).getByRole('button', { name: 'Add candidate' }));
    expect(screen.getByText('Enter the candidate’s name.')).toBeInTheDocument();
    expect(screen.getByText('Enter an email address.')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Name'), 'Nina Test');
    await user.type(screen.getByLabelText('Email'), 'nina@example.com');
    await user.selectOptions(screen.getByLabelText('Position'), 'Intern');
    await user.click(within(form()).getByRole('button', { name: 'Add candidate' }));
    expect(screen.getByRole('status')).toHaveTextContent('Nina Test was added');
    expect(names()).toContain('Nina Test');
    expect(metric('total')).toBe('8');
  });

  it('reset restores the demo data after confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'View details for Aman Singh' }));
    await user.click(screen.getByRole('button', { name: /Advance to/ }));
    await user.click(screen.getByRole('button', { name: 'Reset to demo data' }));
    expect(screen.getByRole('status')).toHaveTextContent('Demo data restored');
    expect(within(rows().find((r) => within(r).queryByText('Aman Singh'))).getByText('OA')).toBeInTheDocument();
  });

  it('exports exactly the visible rows', async () => {
    const user = userEvent.setup();
    let captured;
    const OriginalBlob = globalThis.Blob;
    globalThis.Blob = class extends OriginalBlob { constructor(parts, o) { super(parts, o); captured = parts.join(''); } };
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Intern' }));
    await user.click(screen.getByRole('button', { name: 'Export CSV' }));
    globalThis.Blob = OriginalBlob;
    const lines = captured.replace('﻿', '').trim().split('\r\n');
    expect(lines).toHaveLength(3); // header + 2 interns
    expect(lines[0]).toContain('"Current Stage"');
    expect(captured).toContain('Sneha Iyer');
    expect(captured).not.toContain('Aman Singh');
  });

  it('disables export when nothing matches', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Search candidates'), 'zzzzzz');
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  });
});
