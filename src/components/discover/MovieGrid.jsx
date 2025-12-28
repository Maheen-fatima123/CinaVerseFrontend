import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const MovieGrid = ({ movies, watchlistIds, onAddToWatchlist }) => {
  const navigate = useNavigate();
  const { getMovieDetails } = useStore();

  if (!movies || movies.length === 0) {
    return <p style={{ color: 'var(--muted-text)' }}>No movies found. Try another search.</p>;
  }

  return (
    <div className="row g-4">
      {movies.map((movie) => {
        const poster =
          movie.poster_path || movie.poster
            ? (movie.poster_path || movie.poster).startsWith('http')
              ? movie.poster_path || movie.poster
              : `https://image.tmdb.org/t/p/w500${movie.poster_path || movie.poster}`
            : '/src/assets/placeholder-movie.jpg';

        const rating = movie.vote_average ?? movie.rating;

        return (
          <div className="col-6 col-md-4 col-lg-3" key={movie.id}>
            <div className="discover-card h-100 d-flex flex-column justify-content-between transition-all"
              style={{ borderRadius: '16px', overflow: 'hidden' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                getMovieDetails(movie.id);
              }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div className="discover-poster position-relative" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <img src={poster} alt={movie.title || movie.name} style={{ transition: 'transform 0.5s ease' }} />

                <div className="discover-overlay d-flex flex-column align-items-center justify-content-center">
                  <button
                    className={`btn btn-sm mb-2 ${watchlistIds.includes(String(movie.id)) ? 'btn-success' : 'custom-red-btn'}`}
                    onClick={() => onAddToWatchlist(movie)}
                    disabled={watchlistIds.includes(String(movie.id))}
                  >
                    {watchlistIds.includes(String(movie.id))
                      ? 'In Watchlist'
                      : '+ Watchlist'}
                  </button>
                </div>

                <div className="position-absolute top-0 end-0 m-2 px-2 py-1 text-white d-flex align-items-center gap-1 shadow-sm"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    borderRadius: '50px',
                    fontSize: '10px',
                    fontWeight: '900',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    zIndex: 2
                  }}>
                  <i className="bi bi-star-fill text-warning" style={{ fontSize: '9px' }}></i>
                  {rating != null && !isNaN(Number(rating)) ? Number(rating).toFixed(1) : 'N/A'}
                </div>
              </div>

              <div className="discover-info mt-3 px-2" onClick={e => e.stopPropagation()}>
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="flex-grow-1 overflow-hidden">
                    <h5 className="mb-0 text-truncate fw-bold"
                      style={{ fontSize: '0.9rem', lineHeight: '1.2' }}
                      title={movie.title || movie.name}>
                      {movie.title || movie.name}
                    </h5>
                    <p className="mb-0 text-secondary fw-medium" style={{ fontSize: '0.75rem' }}>
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : movie.year || 'N/A'}
                    </p>
                  </div>

                  <button
                    className="btn custom-red-btn btn-sm flex-shrink-0 fw-black"
                    style={{
                      fontSize: '8px',
                      width: '80px',
                      height: '28px',
                      borderRadius: '8px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
                  >
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovieGrid;
