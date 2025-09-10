import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import PositionFilterTabs from './components/PositionFilterTabs';
import ApplicantListTable from './components/ApplicantListTable';
import ApplicantDetailsForm from './components/ApplicantDetailsForm';
import { initialCompanies, initialApplicants } from './data/data';

function App() {
  const [selectedCompany, setSelectedCompany] = useState(initialCompanies[0].name);
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [applicants, setApplicants] = useState(initialApplicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  // Filter applicants by company and position
  const filteredApplicants = applicants.filter(a =>
    (a.company === selectedCompany) &&
    (selectedPosition === 'All' || a.position === selectedPosition)
  );

  // Select applicant details view
  const selectedApplicant = applicants.find(a => a.id === selectedApplicantId);

  // Update applicant status or round
  const updateApplicant = (id, changes) => {
    setApplicants(applicants.map(a => (a.id === id ? { ...a, ...changes } : a)));
  };

  // -------- EXPORT TO CSV FUNCTION --------
  const handleExportCSV = () => {
    const fields = ['name', 'company', 'position', 'email', 'currentRound', 'status'];
    const csvRows = [
      fields.join(','), // header row
      ...filteredApplicants.map(applicant =>
        fields.map(field => `"${String(applicant[field] || '')}"`).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applicants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <NavigationBar
        companies={initialCompanies}
        onSelect={setSelectedCompany}
        current={selectedCompany}
      />
      <PositionFilterTabs
        positions={['All', ...initialCompanies.find(c => c.name === selectedCompany).positions]}
        selected={selectedPosition}
        onSelect={setSelectedPosition}
      />
      {/* ------------ EXPORT BUTTON ------------- */}
      <div style={{ textAlign: "right", width: "80%", margin: "0 auto" }}>
        <button onClick={handleExportCSV} style={{
          margin: "16px 0",
          padding: "8px 18px",
          border: "none",
          borderRadius: "5px",
          background: "#00B894",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}>
          Export to CSV
        </button>
      </div>
      <div className="main-content">
        <ApplicantListTable
          applicants={filteredApplicants}
          onSelectApplicant={setSelectedApplicantId}
        />
        <ApplicantDetailsForm
          applicant={selectedApplicant}
          onUpdate={updateApplicant}
        />
      </div>
      <Footer />
    </>
  );
}

export default App;
