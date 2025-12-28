import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';
import MovieCarousel from '../components/home/MovieCarousel';
import Footer from '../components/Footer';
import AboutUs from '../components/home/AboutUs';
import { useStore } from '../context/StoreContext';
import '../App.css';

const Home = () => {
  const { getTrendingMovies, getLatestMovies } = useStore();
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    // 1. Immediate sync check for instant load
    const t = getTrendingMovies();
    const l = getLatestMovies();

    if (!(t instanceof Promise)) setTrending(Array.isArray(t) ? t : (t?.results || []));
    if (!(l instanceof Promise)) setLatest(Array.isArray(l) ? l : (l?.results || []));

    // 2. Background/Async load
    Promise.resolve(t).then(data => {
      setTrending(Array.isArray(data) ? data : (data?.results || []));
    }).catch(console.error);

    Promise.resolve(l).then(data => {
      setLatest(Array.isArray(data) ? data : (data?.results || []));
    }).catch(console.error);
  }, [getTrendingMovies, getLatestMovies]);

  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <MovieCarousel title="Trending Now" movies={trending} />
      <MovieCarousel title="Latest Releases" movies={latest} />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default Home;
