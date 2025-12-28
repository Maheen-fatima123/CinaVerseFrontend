import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const { getTrendingMovies, getMovieTrailer } = useStore(); // Use same function as carousel
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTrendingMovies();
        const arr = Array.isArray(res) ? res : res?.results || [];
        const validMovies = arr.filter(m => m.backdrop_path).slice(0, 5);
        setMovies(validMovies);
      } catch {
        setMovies([]);
      }
    };
    load();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % movies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  const goToSlide = (index) => setCurrentSlide(index);

  if (!movies.length) {
    return (
      <div className="hero-carousel" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
        <p style={{ color: 'var(--text-color)' }}>Loading hero slides...</p>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];
  const backdrop = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;
  const movieId = currentMovie.id || currentMovie.tmdbId;

  // Play trailer using the same method as MovieCarousel
  const handlePlay = () => {
    navigate(`/watch/${movieId}`);
  };

  // View movie info (direct navigation)
  const handleViewInfo = () => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="hero-carousel">
      <div className="hero-slide" style={{ backgroundImage: `url(${backdrop})` }}>
        <div className="hero-overlay"></div>
        <div className="container-fluid h-100 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-lg-6 col-md-8">
              <div className="hero-content">
                <h1 className="h3 fw-bold mb-3">{currentMovie.title}</h1>
                <p className="mb-3" style={{ maxWidth: '400px', fontSize: '0.9rem', opacity: 0.9 }}>
                  {currentMovie.overview}
                </p>
                <div className="hero-buttons">
                  <button className="btn custom-red-btn me-2 px-3 py-2" onClick={handlePlay}>
                    <i className="bi bi-play-fill me-1"></i>Play Trailer
                  </button>
                  <button className="btn hero-outline-btn px-3 py-2" onClick={handleViewInfo}>
                    <i className="bi bi-info-circle me-1"></i>More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="hero-arrow-left" onClick={prevSlide}>〈</button>
        <button className="hero-arrow-right" onClick={nextSlide}>〉</button>

        {/* Indicators */}
        <div className="hero-indicators">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
