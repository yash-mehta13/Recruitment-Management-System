import { STAGES, STATUS, STATUSES, FINAL_STAGE } from '../constants';
import { getStatusChangeError } from '../lib/applicants';
import StageTracker from './StageTracker';
import StatusBadge from './StatusBadge';

function ApplicantDetails({ applicant, onAdvance, onRetreat, onStatus, onEdit, onClose }) {
  if (!applicant) {
    return (
      <aside className="card details empty" aria-label="Candidate details">
        <p className="empty-title">No candidate selected</p>
        <p className="muted">Choose &ldquo;View / Update&rdquo; on a row to see details and update progress.</p>
      </aside>
    );
  }

  const inProcess = applicant.status === STATUS.IN_PROCESS;
  const index = STAGES.indexOf(applicant.currentRound);
  const canAdvance = inProcess && index < STAGES.length - 1;
  const canRetreat = inProcess && index > 0;

  return (
    <aside className="card details" aria-labelledby="details-heading">
      <div className="details-head">
        <div>
          <h2 id="details-heading">{applicant.name}</h2>
          <p className="muted">{applicant.position} &middot; {applicant.company}</p>
        </div>
        <button type="button" className="btn btn-ghost btn-small" onClick={onClose} aria-label="Close details">Close</button>
      </div>

      <dl className="detail-list">
        <div><dt>Email</dt><dd>{applicant.email || <span className="muted">Not provided</span>}</dd></div>
        <div><dt>Current stage</dt><dd>{applicant.currentRound}</dd></div>
        <div><dt>Status</dt><dd><StatusBadge status={applicant.status} /></dd></div>
      </dl>

      <section aria-labelledby="stage-heading">
        <h3 id="stage-heading">Recruitment stage</h3>
        <StageTracker current={applicant.currentRound} />
        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={onAdvance} disabled={!canAdvance}>
            {index < STAGES.length - 1 ? `Advance to ${STAGES[index + 1]}` : 'Final stage reached'}
          </button>
          <button type="button" className="btn" onClick={onRetreat} disabled={!canRetreat}>
            Move back a stage
          </button>
        </div>
        {!inProcess && <p className="hint">Stage is locked while status is {applicant.status}. Set status to In Process to change it.</p>}
      </section>

      <section aria-labelledby="status-heading">
        <h3 id="status-heading">Status</h3>
        <div className="button-row" role="group" aria-label="Set status">
          {STATUSES.map((s) => {
            const isCurrent = applicant.status === s;
            const blocked = !isCurrent && getStatusChangeError(applicant, s);
            return (
              <button
                key={s}
                type="button"
                className={`btn status-btn status-${s.toLowerCase().replace(' ', '-')} ${isCurrent ? 'current' : ''}`}
                aria-pressed={isCurrent}
                disabled={isCurrent || Boolean(blocked)}
                title={blocked || undefined}
                onClick={() => onStatus(s)}
              >
                {s === STATUS.IN_PROCESS && applicant.status !== STATUS.IN_PROCESS ? 'Reopen (In Process)' : s}
              </button>
            );
          })}
        </div>
        <p className="hint">Stage is where the candidate is in the process; status is the outcome. Selected is only available at the {FINAL_STAGE} stage.</p>
      </section>

      <div className="button-row">
        <button type="button" className="btn" onClick={onEdit}>Edit candidate</button>
      </div>
    </aside>
  );
}

export default ApplicantDetails;
