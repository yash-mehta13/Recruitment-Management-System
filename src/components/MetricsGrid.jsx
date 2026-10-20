import { stageCounts } from '../lib/applicants';

const TILES = [
  { key: 'total', label: 'Total candidates', hint: 'All statuses' },
  { key: 'active', label: 'Active', hint: 'Status: In Process' },
  { key: 'assessment', label: 'In assessment', hint: 'Active at OA or Coding Round' },
  { key: 'interview', label: 'In interviews', hint: 'Active at Technical Interview or HR' },
  { key: 'selected', label: 'Selected', hint: 'Status: Selected' },
  { key: 'rejected', label: 'Rejected', hint: 'Status: Rejected' },
];

function MetricsGrid({ metrics, scopeLabel, scopedApplicants }) {
  const stages = stageCounts(scopedApplicants);
  const max = Math.max(1, ...stages.map((s) => s.count));
  return (
    <section aria-labelledby="overview-heading" className="container section">
      <div className="section-head">
        <h2 id="overview-heading">Overview</h2>
        <span className="muted">{scopeLabel}</span>
      </div>
      <dl className="metrics">
        {TILES.map((t) => (
          <div className="metric" key={t.key}>
            <dt>{t.label}</dt>
            <dd data-testid={`metric-${t.key}`}>{metrics[t.key]}</dd>
            <span className="metric-hint">{t.hint}</span>
          </div>
        ))}
      </dl>
      <div className="pipeline card">
        <h3>Candidates by current stage</h3>
        <ol className="pipeline-list">
          {stages.map((s) => (
            <li key={s.stage}>
              <span className="pipeline-label">{s.stage}</span>
              <span className="pipeline-bar" aria-hidden="true">
                <span style={{ width: `${(s.count / max) * 100}%` }} />
              </span>
              <span className="pipeline-count">{s.count}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default MetricsGrid;
