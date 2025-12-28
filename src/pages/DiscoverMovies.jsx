import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/discover/SearchBar';
import Filters from '../components/discover/Filters';
import MovieGrid from '../components/discover/MovieGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useStore } from '../context/StoreContext';
import '../App.css';

const DiscoverMovies = () => {
  const { searchMovies, genres, addToWatchlist, getWatchlist, isAuthenticated } = useStore();
  const [query, setQuery] = useState('popular');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [watchlistIds, setWatchlistIds] = useState([]);

  const fetchMovies = React.useCallback(async (q) => {
    setError(null);
    let allMovies = [];
    let seenIds = new Set();
    const keywords = q && q !== 'popular' ? [q] : ['a', 'the'];

    try {
      const responses = await Promise.all(
        keywords.map(kw => {
          const result = searchMovies(kw);
          // If sync (cached), update state immediately for and-blinking/perceived speed
          if (!(result instanceof Promise)) {
            const movies = Array.isArray(result) ? result : (result?.results || []);
            setResults(prev => {
              const updated = [...prev];
              movies.forEach(m => {
                if (!seenIds.has(m.id)) {
                  updated.push(m);
                  seenIds.add(m.id);
                }
              });
              return updated;
            });
          }
          return Promise.resolve(result);
        })
      );

      responses.forEach(data => {
        const movies = Array.isArray(data) ? data : (data?.results || []);
        movies.forEach(m => {
          if (!seenIds.has(m.id)) {
            allMovies.push(m);
            seenIds.add(m.id);
          }
        });
      });

      setResults(allMovies);
      if (allMovies.length === 0) setError('No movies found.');
    } catch (e) {
      setError(e.message || 'Could not load movies');
    } finally {
      setLoading(false);
    }
  }, [searchMovies]);

  useEffect(() => {
    // Show skeleton ONLY on first boot if no cache
    if (results.length === 0) {
      setLoading(true);
      fetchMovies(query === 'popular' ? '' : query);
    }
  }, [fetchMovies, query, results.length]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getWatchlist().then(list => {
      if (Array.isArray(list)) setWatchlistIds(list.map(item => String(item.movieId)));
    }).catch(() => { });
  }, [isAuthenticated, getWatchlist]);

  const filtered = useMemo(() => {
    return results
      .filter((m) => {
        const rating = m.vote_average ?? m.rating ?? 0;
        const poster = m.poster_path || m.poster;
        if (!poster || rating === 0) return false;

        const releaseYear = m.release_date ? new Date(m.release_date).getFullYear() : null;
        const matchesRating = Number(rating) >= minRating;
        const matchesYear = year ? String(releaseYear || '').startsWith(String(year)) : true;
        const matchesGenre = genre
          ? (m.genre_ids?.includes(Number(genre))) || (m.genres?.some(g => g.id === Number(genre)))
          : true;

        return matchesRating && matchesYear && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.vote_average ?? 0) - (a.vote_average ?? 0);
        if (sortBy === 'year') return new Date(b.release_date || 0) - new Date(a.release_date || 0);
        return (b.popularity || 0) - (a.popularity || 0);
      })
      .slice(0, 12);
  }, [results, sortBy, minRating, year, genre]);

  const handleAdd = async (movie) => {
    if (!isAuthenticated) return alert('Please login');

    // Optimization: Use local genres instead of fetching details
    const genreId = movie.genre_ids?.[0];
    const category = genres.find(g => g.id === genreId)?.name || '';

    try {
      await addToWatchlist(movie.id, 'pending', category);
      setWatchlistIds(prev => [...prev, String(movie.id)]);
      alert('Added to watchlist');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <main className="container py-4" style={{ minHeight: '80vh', paddingTop: 80 }}>
        <section className="mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-3">
            <div>
              <h2 className="mb-1" style={{ color: 'var(--text-color)' }}>Discover</h2>
              <p className="mb-0" style={{ color: 'var(--muted-text)' }}>Find your next favorite movie.</p>
            </div>
            <div style={{ minWidth: 280 }}>
              <SearchBar value={query} onChange={setQuery} onSubmit={() => fetchMovies(query)} />
            </div>
          </div>
          <Filters sortBy={sortBy} setSortBy={setSortBy} minRating={minRating} setMinRating={setMinRating} year={year} setYear={setYear} genre={genre} setGenre={setGenre} />
        </section>

        {loading ? <div className="row g-4"><LoadingSkeleton type="card" count={12} /></div> : null}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && <MovieGrid movies={filtered} watchlistIds={watchlistIds} onAddToWatchlist={handleAdd} />}
      </main>
      <Footer />
    </div>
  );
};

export default DiscoverMovies;

