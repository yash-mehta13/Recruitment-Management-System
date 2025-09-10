import React from 'react';

function PositionFilterTabs({ positions, selected, onSelect }) {
  return (
    <div className="filter-tabs">
      {positions.map(pos => (
        <button
          key={pos}
          className={pos === selected ? 'active' : ''}
          onClick={() => onSelect(pos)}
        >
          {pos}
        </button>
      ))}
    </div>
  );
}

export default PositionFilterTabs;
