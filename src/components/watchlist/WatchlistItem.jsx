
import React, { useState } from 'react';

const statusOptions = ['unwatched', 'watching', 'watched'];


const WatchlistItem = ({ item, onRemove, onUpdate }) => {
  const title = item.title || item.name || `Movie #${item.movieId || item.id}`;
  const posterPath = item.poster || item.poster_path;
  const poster = posterPath ? (posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`) : '/src/assets/placeholder-movie.jpg';
  const rating = item.rating || item.vote_average || 'N/A';
  const year = item.year || (item.release_date ? new Date(item.release_date).getFullYear() : '');
  const [status, setStatus] = useState(item.status || 'unwatched');
  const [saving, setSaving] = useState(false);
  // Use genre as category
  const category = item.category || (item.genres && item.genres[0]?.name) || 'Unknown';

  const handleUpdate = async (field, value) => {
    setSaving(true);
    try {
      await onUpdate(item.id, { ...item, [field]: value });
      if (field === 'status') setStatus(value);
    } catch (e) {
      alert('Failed to update: ' + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="watchlist-card">
      <div className="watchlist-poster">
        <img src={poster} alt={title} />
        <div className="watchlist-overlay">
          <button className="btn theme-outline-btn btn-sm" onClick={onRemove} disabled={saving}>Remove</button>
        </div>
        <div className="watchlist-badge">{status}</div>
      </div>
      <div className="watchlist-info">
        <h5>{title}</h5>
        <p className="text-muted">{year}</p>
        <div className="watchlist-meta">⭐ {rating}</div>
        <div className="watchlist-meta">Genre: <span className="fw-bold">{category}</span></div>
        <div className="watchlist-controls mt-2">
          <label className="me-2 text-muted">Status:</label>
          <select value={status} onChange={e => handleUpdate('status', e.target.value)} disabled={saving} className="me-3">
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WatchlistItem;
