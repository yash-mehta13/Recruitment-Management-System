import React from 'react';

function NavigationBar({ companies, onSelect, current }) {
  return (
    <nav className="navbar">
      <ul>
        {companies.map(c => (
          <li
            key={c.name}
            className={current === c.name ? 'active' : ''}
            onClick={() => onSelect(c.name)}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavigationBar;
