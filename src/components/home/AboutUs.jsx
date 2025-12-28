import React from 'react';
import '../../App.css';

const AboutUs = () => {
  return (
    <section className="about-section py-5 position-relative overflow-hidden" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="container py-4 position-relative z-1">

        {/* Heading */}
        <div className="text-center mb-5 fade-slide">
          <h2 className="display-5 fw-bold custom-red-text mb-3">
            About Cinaverse
          </h2>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '720px' }}>
            Cinaverse is your all-in-one cinematic universe — designed for movie
            lovers who crave discovery, reviews, and a beautifully curated
            experience.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4 text-center">

          <div className="col-md-4 fade-slide delay-1">
            <div className="about-card h-100 p-4 rounded-4">
              <i className="bi bi-film fs-1 custom-red-text mb-3 icon-animate"></i>
              <h5 className="fw-semibold mb-2">Our Mission</h5>
              <p className="text-secondary small">
                To bring the magic of cinema to everyone — from timeless classics
                to the latest blockbusters.
              </p>
            </div>
          </div>

          <div className="col-md-4 fade-slide delay-2">
            <div className="about-card h-100 p-4 rounded-4">
              <i className="bi bi-star-fill fs-1 custom-red-text mb-3 icon-animate"></i>
              <h5 className="fw-semibold mb-2">Curated Experience</h5>
              <p className="text-secondary small">
                Explore hand-picked movies, honest reviews, and smart
                recommendations — all in one place.
              </p>
            </div>
          </div>

          <div className="col-md-4 fade-slide delay-3">
            <div className="about-card h-100 p-4 rounded-4">
              <i className="bi bi-people-fill fs-1 custom-red-text mb-3 icon-animate"></i>
              <h5 className="fw-semibold mb-2" style={{ color: 'var(--text-color)' }}>Community First</h5>
              <p className="text-secondary small">
                Built for families, friends, and cinephiles — with a safe,
                inclusive, and modern design.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-5 fade-slide delay-4">
          <p className="small mb-0" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
            Crafted with ❤️ by movie lovers — for movie lovers.
          </p>
        </div>

      </div>

      {/* Background Glow */}
      <div className="about-glow"></div>
    </section>
  );
};

export default AboutUs;
