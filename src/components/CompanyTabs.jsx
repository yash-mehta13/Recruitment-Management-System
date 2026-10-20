function CompanyTabs({ companies, current, counts, onSelect }) {
  return (
    <nav className="company-tabs" aria-label="Company">
      <div className="container">
        <ul>
          {companies.map((c) => (
            <li key={c.name}>
              <button
                type="button"
                className={c.name === current ? 'active' : ''}
                aria-current={c.name === current ? 'true' : undefined}
                onClick={() => onSelect(c.name)}
              >
                {c.name}
                <span className="count">{counts[c.name] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default CompanyTabs;
