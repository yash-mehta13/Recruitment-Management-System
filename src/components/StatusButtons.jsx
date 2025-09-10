import React from 'react';

function StatusButtons({ status, onChange }) {
  return (
    <div>
      <button
        className={status === 'Selected' ? 'selected' : ''}
        onClick={() => onChange('Selected')}
      >
        Select
      </button>
      <button
        className={status === 'Rejected' ? 'rejected' : ''}
        onClick={() => onChange('Rejected')}
      >
        Reject
      </button>
      <button
        className={status === 'In Process' ? 'in-process' : ''}
        onClick={() => onChange('In Process')}
      >
        In Process
      </button>
    </div>
  );
}

export default StatusButtons;
