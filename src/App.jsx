import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CompanyTabs from './components/CompanyTabs';
import MetricsGrid from './components/MetricsGrid';
import Toolbar from './components/Toolbar';
import ApplicantTable from './components/ApplicantTable';
import ApplicantDetails from './components/ApplicantDetails';
import ApplicantForm from './components/ApplicantForm';
import Notices from './components/Notices';
import { initialCompanies } from './data/data';
import { useApplicants } from './hooks/useApplicants';
import { computeMetrics, filterApplicants, sortApplicants } from './lib/applicants';
import { buildExportFilename, downloadCsv, toCsv } from './lib/csv';

function App() {
  const store = useApplicants();
  const { applicants } = store;

  const [company, setCompany] = useState(initialCompanies[0].name);
  const [position, setPosition] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [selectedId, setSelectedId] = useState(null);
  const [formMode, setFormMode] = useState(null); // null | 'add' | 'edit'
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return undefined;
    const t = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(t);
  }, [feedback]);

  const companyConfig = initialCompanies.find((c) => c.name === company);
  const selected = applicants.find((a) => a.id === selectedId) ?? null;

  // Metrics follow company + position; search only narrows the table.
  const scoped = useMemo(() => filterApplicants(applicants, { company, position }), [applicants, company, position]);
  const metrics = useMemo(() => computeMetrics(scoped), [scoped]);
  const visible = useMemo(
    () => sortApplicants(filterApplicants(applicants, { company, position, query }), sort.key, sort.dir),
    [applicants, company, position, query, sort]
  );
  const companyCounts = useMemo(
    () => Object.fromEntries(initialCompanies.map((c) => [c.name, applicants.filter((a) => a.company === c.name).length])),
    [applicants]
  );

  const hasFilters = position !== 'All' || query.trim() !== '';
  const scopeLabel = `${company}${position === 'All' ? ', all positions' : ` · ${position}`}`;

  const report = (result, successText) =>
    setFeedback(result.ok ? { type: 'success', text: successText } : { type: 'error', text: result.error });

  const chooseCompany = (name) => {
    setCompany(name);
    setPosition('All');
    setSelectedId(null);
    setFormMode(null);
  };
  const clearFilters = () => { setPosition('All'); setQuery(''); };

  const handleAdd = (values) => {
    const result = store.add(values);
    if (result.ok) {
      setCompany(result.applicant.company);
      clearFilters();
      setSelectedId(result.applicant.id);
      setFormMode(null);
      report(result, `${result.applicant.name} was added at the Applied stage.`);
    }
    return result;
  };

  const handleEdit = (values) => {
    const result = store.edit(selected.id, values);
    if (result.ok) {
      setFormMode(null);
      report(result, `${result.applicant.name} was updated.`);
    }
    return result;
  };

  const handleAdvance = () => {
    const result = store.advance(selected.id);
    report(result, result.ok ? `${selected.name} moved to ${result.applicant.currentRound}.` : '');
  };
  const handleRetreat = () => {
    const result = store.retreat(selected.id);
    report(result, result.ok ? `${selected.name} moved back to ${result.applicant.currentRound}.` : '');
  };
  const handleStatus = (status) => {
    const result = store.setStatus(selected.id, status);
    report(result, result.ok ? `${selected.name} is now ${status}.` : '');
  };

  const handleExport = () => {
    if (visible.length === 0) {
      setFeedback({ type: 'error', text: 'There are no candidates to export for the current filters.' });
      return;
    }
    downloadCsv(toCsv(visible), buildExportFilename({ company, position }));
    setFeedback({ type: 'success', text: `Exported ${visible.length} candidate${visible.length === 1 ? '' : 's'} to CSV.` });
  };

  const handleReset = () => {
    if (!window.confirm('Replace all candidates with the original demo data? Your changes in this browser will be lost.')) return;
    store.resetToDemo();
    setSelectedId(null);
    setFormMode(null);
    clearFilters();
    setFeedback({ type: 'success', text: 'Demo data restored.' });
  };

  let side;
  if (formMode === 'add') {
    side = (
      <ApplicantForm
        key="add"
        mode="add"
        companies={initialCompanies}
        initial={{ name: '', email: '', company, position: '' }}
        onSubmit={handleAdd}
        onCancel={() => setFormMode(null)}
      />
    );
  } else if (formMode === 'edit' && selected) {
    side = (
      <ApplicantForm
        key={`edit-${selected.id}`}
        mode="edit"
        companies={initialCompanies}
        initial={{ name: selected.name, email: selected.email, company: selected.company, position: selected.position }}
        onSubmit={handleEdit}
        onCancel={() => setFormMode(null)}
      />
    );
  } else {
    side = (
      <ApplicantDetails
        key={selected?.id ?? 'none'}
        applicant={selected}
        onAdvance={handleAdvance}
        onRetreat={handleRetreat}
        onStatus={handleStatus}
        onEdit={() => setFormMode('edit')}
        onClose={() => setSelectedId(null)}
      />
    );
  }

  return (
    <>
      <Header onReset={handleReset} />
      <CompanyTabs companies={initialCompanies} current={company} counts={companyCounts} onSelect={chooseCompany} />
      <main>
        <Notices
          feedback={feedback}
          storageNotice={store.storageNotice}
          onDismissFeedback={() => setFeedback(null)}
          onDismissStorage={store.dismissStorageNotice}
        />
        <MetricsGrid metrics={metrics} scopeLabel={scopeLabel} scopedApplicants={scoped} />
        <section className="container section" aria-labelledby="candidates-heading">
          <div className="section-head">
            <h2 id="candidates-heading">Candidates</h2>
            <span className="muted" data-testid="result-summary">
              Showing {visible.length} of {applicants.filter((a) => a.company === company).length} in {scopeLabel}
              {query.trim() ? ` matching “${query.trim()}”` : ''}
            </span>
            {hasFilters && (
              <button type="button" className="btn-link" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
          <Toolbar
            positions={companyConfig.positions}
            position={position}
            onPosition={setPosition}
            query={query}
            onQuery={setQuery}
            sortKey={sort.key}
            sortDir={sort.dir}
            onSort={(key, dir) => setSort({ key, dir })}
            onAdd={() => { setFormMode('add'); }}
            onExport={handleExport}
            exportDisabled={visible.length === 0}
          />
          <div className="main-grid">
            <ApplicantTable
              applicants={visible}
              selectedId={selectedId}
              onSelect={(id) => { setSelectedId(id); setFormMode(null); }}
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
            />
            {side}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
