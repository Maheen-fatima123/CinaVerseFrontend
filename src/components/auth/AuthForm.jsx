import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, getDashboardPath } from '../../context/StoreContext';

const AuthForm = () => {
  const { register, login, loading, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    remember: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (!isLogin) {
        if (form.password !== form.confirm) {
          setMessage({ type: 'error', text: 'Passwords do not match' });
          return;
        }
        if (!form.firstName.trim() || !form.lastName.trim()) {
          setMessage({ type: 'error', text: 'First and last name are required' });
          return;
        }
        const result = await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });
        if (result?.user) navigate(getDashboardPath(result.user));
      } else {
        const result = await login({
          email: form.email,
          password: form.password,
          remember: form.remember,
        });
        // Immediate navigation - rely on the result directly
        if (result?.user) {
          navigate(getDashboardPath(result.user));
        }
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed',
      });
    }
  };

  // Removed redundant useEffect to prevent double-navigation

  return (
    <div
      className="card mx-auto py-3 px-5 premium-card shadow-lg"
      style={{ maxWidth: 480, background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
    >
      <h2
        className="text-center mb-4 fs-3 fw-normal"
        style={{
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          color: 'var(--primary-red)',
          letterSpacing: 1,
        }}
      >
        {isLogin ? 'Welcome back!' : 'Create account'}
      </h2>

      {message && (
        <div
          className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-grid gap-3">

        {!isLogin && (
          <div className="form-floating">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="form-control"
              style={{ height: '50px', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
              placeholder=""
              required
            />
            <label style={{ color: 'var(--muted-text)' }}>First Name</label>
          </div>
        )}
        {!isLogin && (
          <div className="form-floating">
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="form-control"
              style={{ height: '50px', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
              placeholder=""
              required
            />
            <label style={{ color: 'var(--muted-text)' }}>Last Name</label>
          </div>
        )}
        <div className="form-floating">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            style={{ height: '50px', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
            placeholder=""
            required
          />
          <label style={{ color: 'var(--muted-text)' }}>Email</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            style={{ height: '50px', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
            placeholder=""
            required
          />
          <label style={{ color: 'var(--muted-text)' }}>Password</label>
        </div>

        {!isLogin && (
          <div className="form-floating">
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="form-control"
              style={{ height: '50px', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
              placeholder=""
              required
            />
            <label style={{ color: 'var(--muted-text)' }}>Confirm Password</label>
          </div>
        )}

        {isLogin && (
          <label className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            <span style={{ color: 'var(--muted-text)' }}>Remember me</span>
          </label>
        )}

        <button
          type="submit"
          className="btn custom-red-btn fw-semibold"
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : isLogin
              ? 'Sign In'
              : 'Sign Up'}
        </button>

        <div className="text-center">
          <span style={{ color: 'var(--text-color)' }}>
            {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          </span>
          <button
            type="button"
            className="btn btn-link p-0 custom-red-text"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create account' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
