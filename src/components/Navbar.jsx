import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import logoLight from '../assets/logo-light.png';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
  const navigate = useNavigate();
  const {
    user, logout, activeChildId, clearChildProfile, childProfiles,
    theme, toggleTheme
  } = useStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Find active child profile name
  const activeChild = childProfiles?.find(p => p.id === activeChildId);

  // Only show links based on user role
  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    user && { name: 'Watchlist', path: '/watchlist' },
    user && { name: 'Dashboard', path: '/dashboard' },
  ].filter(Boolean);

  const handleLogout = () => {
    clearChildProfile();
    logout();
    setIsMenuOpen(false);
    navigate('/auth', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid px-lg-5 px-3">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={() => setIsMenuOpen(false)}>
          <img src={theme === 'dark' ? logo : logoLight} alt="Cinaverse Logo" className="navbar-logo me-2" />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none d-lg-none"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <X size={28} color={theme === 'dark' ? '#ffffff' : '#000000'} />
          ) : (
            <Menu size={28} color={theme === 'dark' ? '#ffffff' : '#000000'} />
          )}
        </button>

        {/* Collapsible Content */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''} justify-content-between`} id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {navigationLinks.map((link) => (
              <li key={link.name} className="nav-item mx-lg-2 my-1 my-lg-0">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link custom-nav-link${isActive ? ' active-link' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                  end
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth & Theme Actions */}
          <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-center mt-3 mt-lg-0 pb-3 pb-lg-0">
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-link text-white p-2 border-0 shadow-none theme-toggle-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-dark" />}
              </button>
              <span className="d-lg-none text-muted small uppercase fw-bold tracking-widest" style={{ fontSize: '10px' }}>
                Toggle Theme
              </span>
            </div>

            {activeChild && (
              <span className="badge custom-red text-white fw-black px-3 py-2 rounded-pill shadow-sm text-center" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                PROFILING: {activeChild.name.toUpperCase()}
              </span>
            )}

            {!user ? (
              <Link to="/auth" className="btn theme-outline-btn fw-bold px-4 rounded-pill" onClick={() => setIsMenuOpen(false)}>
                Login / Signup
              </Link>
            ) : (
              <button
                className="btn theme-outline-btn fw-bold px-4 rounded-pill hover-red"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

