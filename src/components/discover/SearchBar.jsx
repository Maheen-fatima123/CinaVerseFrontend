import React from 'react';

const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    <form className="search-bar rounded-3 p-2 d-flex align-items-center" style={{ backgroundColor: 'var(--background-color)' }} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input
        type="text"
        className="form-control me-2"
        style={{ backgroundColor: 'transparent', color: 'var(--text-color)', border: 'none', minWidth: 180 }}
        placeholder="Search movies by title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="btn custom-red-btn">Search</button>
    </form>
  );
};

export default SearchBar;
