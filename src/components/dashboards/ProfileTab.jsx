import { useState, useEffect } from 'react';

const ProfileTab = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const labelStyle = {
    color: 'var(--text-color)',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div className="premium-card">
      <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>My Dashboard</h2>

      <div>
        <h3 className="text-danger mb-4 border-bottom border-secondary pb-3 fs-6 fw-bold uppercase tracking-widest">Account Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="mb-0">
                <label htmlFor="firstName" className="form-label mb-2" style={labelStyle}>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-0">
                <label htmlFor="lastName" className="form-label mb-2" style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-0">
              <label htmlFor="email" className="form-label mb-2" style={labelStyle}>Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn custom-red-btn px-5 py-2.5" disabled={isSaving}>
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
