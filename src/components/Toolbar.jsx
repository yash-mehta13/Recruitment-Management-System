import { SORT_KEYS } from '../lib/applicants';

const SORT_LABELS = { name: 'Name', position: 'Position', currentRound: 'Stage', status: 'Status' };

function Toolbar({
  positions, position, onPosition,
  query, onQuery,
  sortKey, sortDir, onSort,
  onAdd, onExport, exportDisabled,
}) {
  return (
    <div className="toolbar">
      <div className="chips" role="group" aria-label="Filter by position">
        {['All', ...positions].map((p) => (
          <button
            key={p}
            type="button"
            className={`chip ${p === position ? 'active' : ''}`}
            aria-pressed={p === position}
            onClick={() => onPosition(p)}
          >
            {p === 'All' ? 'All positions' : p}
          </button>
        ))}
      </div>
      <div className="toolbar-row">
        <div className="field grow">
          <label htmlFor="search">Search candidates</label>
          <input
            id="search"
            type="search"
            value={query}
            placeholder="Name, email, position, stage or status"
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="sort-key">Sort by</label>
          <select id="sort-key" value={sortKey} onChange={(e) => onSort(e.target.value, sortDir)}>
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort-dir">Order</label>
          <select id="sort-dir" value={sortDir} onChange={(e) => onSort(sortKey, e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-primary" onClick={onAdd}>Add candidate</button>
          <button
            type="button"
            className="btn"
            onClick={onExport}
            disabled={exportDisabled}
            title={exportDisabled ? 'No candidates to export' : 'Download the candidates shown in the table as CSV'}
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
