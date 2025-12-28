import React from 'react';
import { useStore } from '../../context/StoreContext';

const Filters = ({ sortBy, setSortBy, minRating, setMinRating, year, setYear, genre, setGenre }) => {
  const { genres } = useStore();

  return (
    <div className="discover-filters d-flex flex-wrap gap-4 align-items-center mb-4">
      <div className="d-flex align-items-center gap-2">
        <label className="mb-0 text-nowrap" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort by</label>
        <select className="form-select" style={{ width: 'auto', minWidth: '140px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="d-flex align-items-center gap-2">
        <label className="mb-0 text-nowrap" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rating</label>
        <select className="form-select" style={{ width: 'auto', minWidth: '110px' }} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>Any</option>
          <option value={6}>6+</option>
          <option value={7}>7+</option>
          <option value={8}>8+</option>
          <option value={9}>9+</option>
        </select>
      </div>

      <div className="d-flex align-items-center gap-2">
        <label className="mb-0 text-nowrap" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</label>
        <input
          type="number"
          className="form-control"
          style={{ width: '100px' }}
          placeholder="2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        <label className="mb-0 text-nowrap" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Genre</label>
        <select className="form-select" style={{ width: 'auto', minWidth: '140px' }} value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">Any</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
