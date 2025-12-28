import React from 'react';

const MovieResultCard = ({ movie, onAdd }) => {
  const title = movie.title || movie.name;
  const posterPath = movie.poster_path || movie.poster;
  const poster = posterPath ? (posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`) : '/src/assets/placeholder-movie.jpg';
  const rating = movie.vote_average || movie.rating || 'N/A';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year;

  return (
    <div className="discover-card">
      <div className="discover-poster">
        <img src={poster} alt={title} />
        <div className="discover-overlay">
          <button className="btn custom-red-btn btn-sm" onClick={() => onAdd(movie)}>
            + Watchlist
          </button>
        </div>
        <div className="discover-rating">⭐ {rating}</div>
      </div>
      <div className="discover-info">
        <h5>{title}</h5>
        <p className="text-muted">{year}</p>
        <p className="discover-overview">{movie.overview || movie.plot || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default MovieResultCard;
