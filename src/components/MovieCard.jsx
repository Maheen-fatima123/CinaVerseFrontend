import React from 'react';

export default function MovieCard({ image, title, year, genre, rating, status, onViewDetails, showViewDetails, children }) {
  return (
    <div
      className="discover-card h-100 d-flex flex-column justify-content-between position-relative"
      onClick={onViewDetails}
    >
      <div className="discover-poster position-relative">
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Status Badge - Top Left */}
        {status && (
          <div
            className="position-absolute top-0 start-0 m-2 px-2 py-1 text-white"
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 'bold',
              backdropFilter: 'blur(8px)',
              zIndex: 2
            }}
          >
            {status === 'watched' ? 'WATCHED' : 'PENDING'}
          </div>
        )}

        {/* Rating - Top Right */}
        {rating && (
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
            {Number(rating).toFixed(1)}
          </div>
        )}

        {/* Hover Overlay Button */}
        {showViewDetails && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
          >
            <button
              className="btn custom-red-btn btn-sm"
              style={{ borderRadius: '12px' }}
              onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
            >
              <i className="bi bi-info-circle me-2"></i>View Details
            </button>
          </div>
        )}
      </div>
      <div className="discover-info mt-3 px-2" onClick={e => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="mb-0 text-truncate fw-bold"
              style={{ fontSize: '0.9rem', lineHeight: '1.2' }}
              title={title}>
              {title}
            </h5>
            <p className="mb-0 text-secondary fw-medium" style={{ fontSize: '0.75rem' }}>
              {year || 'N/A'}
            </p>
          </div>

          {showViewDetails && (
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
              onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
            >
              VIEW DETAILS
            </button>
          )}
        </div>
        {children && <div className="mt-2 w-100">{children}</div>}
      </div>
    </div>
  );
}
