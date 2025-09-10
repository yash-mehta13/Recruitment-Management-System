import React from 'react';

function ApplicantListTable({ applicants, onSelectApplicant }) {
  return (
    <table className="applicant-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Current Round</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {applicants.map(a => (
          <tr key={a.id}>
            <td>{a.name}</td>
            <td>{a.position}</td>
            <td>{a.currentRound}</td>
            <td>{a.status}</td>
            <td>
              <button onClick={() => onSelectApplicant(a.id)}>
                View / Update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicantListTable;
