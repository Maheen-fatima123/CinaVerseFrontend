import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { getMovieDetails, getMovieTrailer, addToWatchlist, getWatchlist, isAuthenticated } = useStore();

  // Try to get initial movie data from navigation state
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(!movie);
  const [error, setError] = useState(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    // Theme is handled by root, no need to force body background here

    // 1. Check if we have enough data (maybe from state or cache)
    const cachedData = getMovieDetails(id);
    const isAsync = (cachedData instanceof Promise);

    // If we have state, or synchronous cache data, we don't show loading
    if (movie) {
      setLoading(false);
    } else if (!isAsync) {
      setMovie(cachedData);
      setLoading(false);
    } else {
      setLoading(true);
    }

    const fetchData = async () => {
      try {
        const data = await (isAsync ? cachedData : getMovieDetails(id));
        setMovie(data);
        setError(null);
      } catch (err) {
        if (!movie) setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }

      Promise.resolve(getMovieTrailer(id)).then(d => setTrailerUrl(d?.trailerUrl)).catch(() => { });
      if (isAuthenticated) {
        Promise.resolve(getWatchlist()).then(list => {
          const inList = Array.isArray(list) && list.some(item => String(item.movieId) === String(id));
          setIsInWatchlist(inList);
        }).catch(() => { });
      }
    };

    fetchData();

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [id, isAuthenticated]);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add movies to your watchlist!');
      return;
    }

    setAddingToWatchlist(true);
    try {
      // Get category from movie genres
      let category = '';
      if (movie && movie.genres && movie.genres.length > 0) {
        category = movie.genres[0].name;
      }

      await addToWatchlist(id, 'pending', category);
      setIsInWatchlist(true); // Update state on success
      alert('Added to watchlist successfully!');
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      const msg = error.message || 'Failed to add to watchlist';
      alert(msg);
      if (msg.includes('already in your watchlist')) {
        setIsInWatchlist(true); // Update state if backend says it exists
      }
    } finally {
      setAddingToWatchlist(false);
    }
  };

  if (loading) return <div className="min-vh-100" style={{ backgroundColor: 'var(--background-color)' }}><Navbar /><div className="text-center mt-5" style={{ color: 'var(--text-color)' }}>Loading...</div></div>;
  if (error) return <div className="min-vh-100" style={{ backgroundColor: 'var(--background-color)' }}><Navbar /><div className="text-danger text-center mt-5">{error}</div></div>;
  if (!movie) return <div className="min-vh-100" style={{ backgroundColor: 'var(--background-color)' }}><Navbar /><div className="text-center mt-5" style={{ color: 'var(--text-color)' }}>Movie not found.</div></div>;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : 'https://via.placeholder.com/400x600?text=No+Image';

  return (
    <div className="movie-details-bg" style={{ fontFamily: 'Nunito, Inter, Arial, sans-serif', fontWeight: 400, letterSpacing: 0.1, fontSize: '15px', paddingTop: 64 }}>
      <Navbar />
      <div className="container py-4" style={{ borderRadius: 18, background: 'transparent' }}>
        <div className="row g-4 align-items-start mt-6">
          <div className="col-md-4 text-center">
            <img
              src={poster}
              alt={movie.title}
              className="img-fluid rounded shadow mb-3"
              style={{ maxHeight: 500, objectFit: 'cover', background: '#222', borderRadius: 18 }}
            />
          </div>
          <div className="col-md-8 d-flex flex-column justify-content-between premium-card shadow-lg" style={{ borderRadius: 24, backgroundColor: 'var(--card-bg)' }}>
            <div>
              <h2 className="mb-2 fw-bold fs-2" style={{ letterSpacing: '-0.02em', color: 'var(--text-color)' }}>
                {movie.title} {movie.release_date && <span className="text-secondary fw-normal fs-5">({new Date(movie.release_date).getFullYear()})</span>}
              </h2>
              <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
                <span className="badge border" style={{ fontSize: 13, borderRadius: 50, padding: '0.4em 0.8em', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color) !important' }}>
                  <i className="bi bi-star-fill me-1 text-warning"></i>{movie.vote_average?.toFixed(1)}
                </span>
                {movie.runtime && (
                  <span className="badge border" style={{ fontSize: 13, borderRadius: 50, padding: '0.4em 0.8em', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color) !important' }}>
                    <i className="bi bi-clock me-1 text-danger"></i>{movie.runtime}m
                  </span>
                )}
                {movie.genres && movie.genres.slice(0, 3).map(g => (
                  <span key={g.id} className="badge bg-danger text-white" style={{ fontSize: 13, borderRadius: 50, padding: '0.4em 0.8em' }}>
                    {g.name}
                  </span>
                ))}
              </div>
              <p className="text-secondary mb-3 fs-6 leading-relaxed" style={{ fontWeight: 400 }}>
                {movie.overview || 'No overview available.'}
              </p>
              {movie.tagline && <p className="text-secondary fst-italic mb-3 opacity-75">"{movie.tagline}"</p>}

              <div className="mt-3 d-flex flex-column gap-1">
                <div className="text-secondary text-xs tracking-wide">
                  <span className="me-3 opacity-75 fw-bold" style={{ color: 'var(--text-color)' }}>Release Date:</span>
                  <span style={{ color: 'var(--text-color)' }}>{movie.release_date || 'N/A'}</span>
                </div>
                <div className="text-secondary text-xs tracking-wide">
                  <span className="me-3 opacity-75 fw-bold" style={{ color: 'var(--text-color)' }}>Language:</span>
                  <span style={{ color: 'var(--text-color)' }}>{movie.original_language?.toUpperCase() || 'N/A'}</span>
                </div>
                <div className="text-secondary text-xs tracking-wide">
                  <span className="me-3 opacity-75 fw-bold" style={{ color: 'var(--text-color)' }}>Status:</span>
                  <span style={{ color: 'var(--text-color)' }}>{movie.status || 'N/A'}</span>
                </div>
                {movie.homepage && (
                  <div className="text-secondary text-xs tracking-wide">
                    <span className="me-3 opacity-75 fw-bold" style={{ color: 'var(--text-color)' }}>Website:</span>
                    <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="text-danger text-decoration-none hover:underline">{movie.homepage.replace(/(^\w+:|^)\/\//, '')}</a>
                  </div>
                )}
              </div>
            </div>
            {/* Action buttons */}
            <div className="mt-4 d-flex gap-3 flex-wrap">
              {trailerUrl ? (
                <Link
                  to={`/watch/${id}`}
                  className="btn custom-red-btn px-4 py-2"
                  style={{ fontSize: 15, borderRadius: 12, fontWeight: 600 }}
                >
                  <i className="bi bi-play-fill me-2" style={{ fontSize: 20, color: '#fff' }}></i>Watch Trailer
                </Link>
              ) : (
                <button className="btn custom-red-btn px-4 py-2" style={{ fontSize: 15, borderRadius: 12, fontWeight: 600 }} disabled>
                  <i className="bi bi-x-circle me-2" style={{ fontSize: 20, color: '#fff' }}></i>Trailer Not Available
                </button>
              )}

              {/* Add to Watchlist Button */}
              <button
                className={`btn px-4 py-2 ${isInWatchlist ? 'btn-success' : 'theme-outline-btn'}`}
                style={{ fontSize: 15, borderRadius: 12, fontWeight: 600 }}
                onClick={handleAddToWatchlist}
                disabled={addingToWatchlist || isInWatchlist}
              >
                <i className={`bi ${isInWatchlist ? 'bi-check-circle-fill' : 'bi-plus-circle'} me-2`} style={{ fontSize: 20 }}></i>
                {addingToWatchlist ? 'Adding...' : isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
