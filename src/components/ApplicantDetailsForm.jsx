import React, { useState } from 'react';
import StatusButtons from './StatusButtons';

const rounds = ['Applied', 'OA', 'Coding Round', 'Technical Interview', 'HR', 'Final Offer'];

function ApplicantDetailsForm({ applicant, onUpdate }) {
  if (!applicant) return <div className="details-form">Select an applicant to view details.</div>;

  const [currentRound, setCurrentRound] = useState(applicant.currentRound);

  const handleAdvanceRound = () => {
    const nextRoundIndex = rounds.indexOf(applicant.currentRound) + 1;
    if (nextRoundIndex < rounds.length) {
      onUpdate(applicant.id, { currentRound: rounds[nextRoundIndex] });
    }
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(applicant.id, { status: newStatus });
  };

  return (
    <div className="details-form">
      <h3>{applicant.name} - {applicant.position}</h3>
      <p>Company: {applicant.company}</p>
      <p>Email: {applicant.email}</p>
      <p>Current Round: {applicant.currentRound}</p>
      <button onClick={handleAdvanceRound}>Advance to Next Round</button>
      <StatusButtons
        status={applicant.status}
        onChange={handleStatusChange}
      />
    </div>
  );
}

export default ApplicantDetailsForm;
