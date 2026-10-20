import { useState } from 'react';

/**
 * Add / edit form. Mounted with a `key` per candidate/mode so its local
 * state can never leak between records.
 */
function ApplicantForm({ mode, companies, initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const company = companies.find((c) => c.name === values.company) ?? companies[0];
  const isEdit = mode === 'edit';

  const set = (field) => (e) => {
    const value = e.target.value;
    setValues((v) => {
      const next = { ...v, [field]: value };
      if (field === 'company') next.position = '';
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onSubmit(values);
    if (!result.ok) setErrors(result.errors ?? {});
  };

  const err = (f) => errors[f];
  const describe = (f) => (err(f) ? `${f}-error` : undefined);

  return (
    <form className="card details form" onSubmit={handleSubmit} noValidate aria-labelledby="form-heading">
      <h2 id="form-heading">{isEdit ? 'Edit candidate' : 'Add candidate'}</h2>

      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" value={values.name} onChange={set('name')} autoFocus
          aria-invalid={Boolean(err('name'))} aria-describedby={describe('name')} required />
        {err('name') && <p className="field-error" id="name-error">{err('name')}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" type="email" value={values.email} onChange={set('email')}
          aria-invalid={Boolean(err('email'))} aria-describedby={describe('email')} required />
        {err('email') && <p className="field-error" id="email-error">{err('email')}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-company">Company</label>
        <select id="f-company" value={values.company} onChange={set('company')} disabled={isEdit}
          aria-invalid={Boolean(err('company'))} aria-describedby={describe('company')}>
          {companies.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        {err('company') && <p className="field-error" id="company-error">{err('company')}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-position">Position</label>
        <select id="f-position" value={values.position} onChange={set('position')}
          aria-invalid={Boolean(err('position'))} aria-describedby={describe('position')} required>
          <option value="">Select a position</option>
          {company.positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {err('position') && <p className="field-error" id="position-error">{err('position')}</p>}
      </div>

      {!isEdit && <p className="hint">New candidates start at the Applied stage with status In Process.</p>}

      <div className="button-row">
        <button type="submit" className="btn btn-primary">{isEdit ? 'Save changes' : 'Add candidate'}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ApplicantForm;
