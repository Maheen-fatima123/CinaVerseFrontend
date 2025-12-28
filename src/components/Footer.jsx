import React from 'react';

export default function Footer() {
  return (
    <footer className="simple-footer">
      <div className="container text-center py-4">
        <h4 className="fw-bold mb-2" style={{ color: 'var(--primary-red)' }}>Cinaverse</h4>
        <div className="mb-2" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Your Gateway to Cinematic Excellence</div>
        <div className="mb-3">
          <a href="#privacy" className="mx-3 text-decoration-none" style={{ color: 'var(--primary-red)' }}>Privacy Policy</a>
          <a href="#terms" className="mx-3 text-decoration-none" style={{ color: 'var(--primary-red)' }}>Terms of Service</a>
          <a href="#cookies" className="mx-3 text-decoration-none" style={{ color: 'var(--primary-red)' }}>Cookie Settings</a>
        </div>
        <div style={{ color: 'var(--text-color)', fontSize: 14, opacity: 0.7 }}>
          © 2024 Cinaverse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
