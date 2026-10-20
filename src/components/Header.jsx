function Header({ onReset }) {
  return (
    <header className="app-header">
      <div className="container header-inner">
        <div>
          <h1>Recruitment Management System</h1>
          <p className="header-sub">Track candidates through the hiring pipeline.</p>
        </div>
        <div className="header-meta">
          <span className="badge badge-neutral" title="Candidate data is synthetic and stored only in this browser (localStorage). It is not shared or synced.">
            Demo data &middot; saved in this browser only
          </span>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Reset to demo data
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
