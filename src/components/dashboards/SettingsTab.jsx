import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

const SettingsTab = () => {
  const { user, updateProfile, theme, toggleTheme } = useStore();
  const [isPromoting, setIsPromoting] = useState(false);

  const handlePromote = async () => {
    if (!window.confirm('Do you want to promote your account to a Parent profile? This will allow you to manage child profiles.')) return;
    setIsPromoting(true);
    try {
      await updateProfile({ role: 'parent' });
      alert('Promotion successful! You are now a Parent user. Please refresh or re-login to see all parent dashboard features.');
      window.location.reload(); // Hard reload to trigger dashboard role checks
    } catch (error) {
      console.error('Promotion failed:', error);
      alert('Promotion failed: ' + error.message);
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="premium-card">
      <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>Account Settings</h2>

      <div className="d-flex flex-column gap-4">
        {/* Role Management */}
        <div className="p-4 rounded-card border shadow-sm" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
          <h4 className="mb-1 fs-6 fw-bold uppercase tracking-widest" style={{ color: 'var(--text-color)' }}>Account Status</h4>
          <p className="mb-4 font-medium uppercase tracking-tight" style={{ color: 'var(--muted-text)', fontSize: '11px' }}>
            Upgrade your account to a Parent profile to unlock restricted content management and child profiles.
          </p>
          {user?.role !== 'parent' ? (
            <button
              className="btn custom-red-btn btn-sm px-4 py-2"
              onClick={handlePromote}
              disabled={isPromoting || user?.role === 'admin'}
            >
              <i className="bi bi-arrow-up-circle me-2"></i>
              {isPromoting ? 'Upgrading...' : 'Promote to Parent'}
            </button>
          ) : (
            <div className="d-inline-flex align-items-center bg-success/10 text-success border border-success/20 px-4 py-2 rounded-pill shadow-sm">
              <i className="bi bi-patch-check-fill me-2 fs-5"></i>
              <span className="fw-bold small tracking-wider">VERIFIED PARENT ACCOUNT</span>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="p-4 rounded-card border shadow-sm" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
          <h4 className="mb-1 fs-6 fw-bold uppercase tracking-widest" style={{ color: 'var(--text-color)' }}>Display Preferences</h4>
          <p className="mb-4 font-medium uppercase tracking-tight" style={{ color: 'var(--muted-text)', fontSize: '11px' }}>
            Adjust the visual experience of Cinaverse on your current device.
          </p>
          <div className="d-flex align-items-center gap-4">
            <button
              className="btn btn-outline-danger btn-sm border-2 px-4 py-2 fw-bold transition-all"
              style={{ borderRadius: '12px' }}
              onClick={toggleTheme}
            >
              <i className="bi bi-palette2 me-2"></i>Toggle Cinematic Mode
            </button>
            <div className="d-flex flex-column">
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--muted-text)' }}>Active Look:</span>
              <span className="text-sm italic font-medium" style={{ color: 'var(--text-color)' }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
