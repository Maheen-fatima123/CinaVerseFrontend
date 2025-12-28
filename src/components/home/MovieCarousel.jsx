
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const MovieCarousel = ({ title, movies }) => {
  const scrollRef = useRef(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const { getMovieTrailer, getMovieDetails } = useStore();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleImageError = (movieId) => {
    setFailedImages(prev => new Set([...prev, movieId]));
  };

  // Use context getMovieTrailer for consistent trailer fetching
  const playTrailer = (movie) => {
    const tmdbId = movie.tmdbId || movie.id;
    navigate(`/watch/${tmdbId}`);
  };

  // Filter out movies with failed images
  const validMovies = movies.filter(movie => {
    const movieId = movie.id || movie.tmdbId;
    return !failedImages.has(movieId);
  });

  return (
    <div className="movie-carousel-section">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">{title}</h2>
          <div className="carousel-controls">
            <button
              className="carousel-btn"
              onClick={() => scroll('left')}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="carousel-btn"
              onClick={() => scroll('right')}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
        <div className="movie-section-card">
          <div className="movie-carousel-container" ref={scrollRef}>
            <div className="movie-carousel-track">
              {validMovies.map((movie, index) => {
                const posterPath = movie.poster || movie.poster_path || movie.backdrop_path;
                const src = posterPath
                  ? (posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`)
                  : '/src/assets/placeholder-movie.jpg';
                const rating = movie.rating || movie.vote_average;
                const title = movie.title || movie.name || 'Untitled';
                const year = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '');
                const overview = movie.overview || '';
                const movieId = movie.id || movie.tmdbId;
                return (
                  <div
                    key={index}
                    className="movie-card"
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      // Pre-fetch for instant loading
                      getMovieDetails(movieId);
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => navigate(`/movie/${movieId}`, { state: { movie } })}
                  >
                    <div className="movie-poster">
                      <img
                        src={src}
                        alt={title}
                        className="movie-image"
                        loading="lazy"
                        onError={() => handleImageError(movieId)}
                      />
                      {/* Show title overlay on hover */}
                      <div className="movie-title-overlay">
                        {title}
                      </div>

                      {/* Play button overlay on hover */}
                      <button
                        className="btn custom-red-btn play-btn"
                        style={{ borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                        onClick={e => { e.stopPropagation(); playTrailer(movie); }}
                        aria-label="Play Trailer"
                      >
                        <i className="bi bi-play-fill" style={{ color: '#fff', fontSize: 28 }}></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
