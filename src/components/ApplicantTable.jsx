import StatusBadge from './StatusBadge';

function ApplicantTable({ applicants, selectedId, onSelect, hasFilters, onClearFilters }) {
  if (applicants.length === 0) {
    return (
      <div className="card empty">
        <p className="empty-title">No candidates match.</p>
        <p className="muted">
          {hasFilters
            ? 'Try a different search or position filter.'
            : 'There are no candidates for this company yet. Use "Add candidate" to create one.'}
        </p>
        {hasFilters && (
          <button type="button" className="btn" onClick={onClearFilters}>Clear search and position filter</button>
        )}
      </div>
    );
  }
  return (
    <div className="card table-wrap">
      <table className="applicant-table">
        <caption className="sr-only">Candidates for the selected company and filters</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col" className="col-email">Email</th>
            <th scope="col">Stage</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr key={a.id} className={a.id === selectedId ? 'selected-row' : ''}>
              <th scope="row" className="cell-name">{a.name}</th>
              <td>{a.position}</td>
              <td className="col-email">{a.email || <span className="muted">&mdash;</span>}</td>
              <td>{a.currentRound}</td>
              <td><StatusBadge status={a.status} /></td>
              <td className="cell-actions">
                <button
                  type="button"
                  className="btn btn-small"
                  aria-pressed={a.id === selectedId}
                  aria-label={`View details for ${a.name}`}
                  onClick={() => onSelect(a.id)}
                >
                  View / Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantTable;
