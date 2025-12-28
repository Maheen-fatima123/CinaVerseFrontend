import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import MovieCard from '../components/MovieCard';
import '../App.css';

const statusOptions = ['unwatched', 'watching', 'watched'];

const Watchlist = () => {
  const { getWatchlist, removeFromWatchlist, updateWatchlist, getMovieDetails, genres } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsMap, setDetailsMap] = useState({});
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWatchlist();
      const watchlistItems = Array.isArray(data) ? data : [];
      setItems(watchlistItems);
      setLoading(false); // Show items immediately with basic info

      // Load movie details progressively in background (non-blocking)
      if (watchlistItems.length > 0) {
        const details = {};

        // Load details in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < watchlistItems.length; i += batchSize) {
          const batch = watchlistItems.slice(i, i + batchSize);

          await Promise.all(batch.map(async (item) => {
            try {
              const movieDetails = await getMovieDetails(item.movieId);
              details[item.id] = movieDetails;
              // Update state incrementally as details load
              setDetailsMap(prev => ({ ...prev, [item.id]: movieDetails }));
            } catch (e) {
              console.error(`Failed to load details for movie ${item.movieId}`, e);
            }
          }));
        }
      }
    } catch (e) {
      setError(e.message || 'Failed to load watchlist');
      setItems([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWatchlist(id); // id is always the watchlist entry id
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert(e.message || 'Failed to remove');
    }
  };

  const handleUpdate = async (id, update) => {
    // Optimistic UI update: update state immediately
    const prevItems = [...items];
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...update } : i)));

    try {
      await updateWatchlist(id, update);
    } catch (e) {
      // Revert if API call fails
      setItems(prevItems);
      alert(e.message || 'Failed to update');
    }
  };

  // Use all genres from TMDB for filter dropdown
  const allGenres = genres && genres.length
    ? genres.map((g) => g.name)
    : Array.from(new Set(
      Object.values(detailsMap)
        .flatMap((d) => (d.genres ? d.genres.map((g) => g.name) : []))
    ));

  // Filter items by selected genre and status
  const filteredItems = items.filter((item) => {
    const details = detailsMap[item.id] || {};
    const matchesGenre = !genreFilter || (details.genres && details.genres.some((g) => g.name === genreFilter));
    const matchesStatus = statusFilter === 'all' || (item.status || 'pending') === statusFilter;
    return matchesGenre && matchesStatus;
  });

  return (
    <div className="min-vh-100" style={{ paddingTop: 64, backgroundColor: 'var(--background-color)' }}>
      <Navbar />
      <main className="container py-4" style={{ minHeight: '80vh', paddingTop: 80 }}>
        <div className="watchlist-filters d-flex flex-wrap align-items-center justify-content-between mb-4">
          <div>
            <h2 className="mb-1" style={{ color: 'var(--text-color)' }}>My Watchlist</h2>
            <p className="text-secondary mb-0">Organize and track your favorite movies by genre and status.</p>
          </div>
          <div className="d-flex gap-3">
            <div>
              <label className="form-label mb-1" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>Status</label>
              <select className="form-select border-secondary" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Any Status</option>
                <option value="pending">Pending</option>
                <option value="watched">Watched</option>
              </select>
            </div>
            {allGenres.length > 0 && (
              <div>
                <label className="form-label mb-1" style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>Genre</label>
                <select className="form-select border-secondary" style={{ width: 140 }} value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                  <option value="">All Genres</option>
                  {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
        {loading && <div className="text-center text-secondary py-5">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {!loading && filteredItems.map((item) => {
            const details = detailsMap[item.id] || {};
            const genre = (details.genres && details.genres[0]?.name) || item.category || 'Unknown';
            const poster = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '/src/assets/placeholder-movie.jpg';
            const year = details.release_date ? new Date(details.release_date).getFullYear() : '';
            const rating = details.vote_average || details.rating;
            // Use the status from the item, not details
            const status = item.status || 'pending';

            return (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <MovieCard
                  image={poster}
                  title={details.title || item.title}
                  year={year}
                  genre={genre}
                  rating={rating}
                  status={status}
                  showViewDetails={true}
                  onViewDetails={() => window.open(`/movie/${item.movieId}`, '_self')}
                >
                  <div className="d-flex w-100 mt-2 gap-2">
                    {/* Mark Status Button - Takes remaining width */}
                    <button
                      className={`btn btn-sm flex-grow-1 ${status === 'watched' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => handleUpdate(item.id, { status: status !== 'watched' ? 'watched' : 'pending' })}
                    >
                      {status !== 'watched' ? 'Mark Watched' : 'Mark Pending'}
                    </button>

                    {/* Delete Icon Button - Fixed width */}
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                      style={{ width: '40px' }}
                      onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </MovieCard>
              </div>
            );
          })}
        </div>
        {!loading && filteredItems.length === 0 && <div className="text-center text-secondary py-5">Your watchlist is empty or no matches found.</div>}
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;
