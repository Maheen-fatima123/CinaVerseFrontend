import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

const ChildManagementTab = () => {
    const {
        listChildProfiles,
        createChildProfile,
        deleteChildProfile,
        selectChildProfile,
        activeChildId,
        clearChildProfile
    } = useStore();

    const [profiles, setProfiles] = useState([]);
    const [form, setForm] = useState({ name: '', age: 10, allowedGenres: 'animation,family', maxAgeRating: 'PG' });
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadProfiles = async () => {
        try {
            const cps = await listChildProfiles();
            setProfiles(Array.isArray(cps) ? cps : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfiles();
    }, []);

    const handleCreateChild = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await createChildProfile(form);
            await loadProfiles();
            setForm({ name: '', age: 10, allowedGenres: 'animation,family', maxAgeRating: 'PG' });
            alert('Child profile created!');
        } catch (e) {
            alert(e.message || 'Could not create profile');
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this child profile?')) return;
        setBusy(true);
        try {
            await deleteChildProfile(id);
            await loadProfiles();
            if (activeChildId === id) clearChildProfile();
        } catch (e) {
            alert(e.message || 'Delete failed');
        } finally {
            setBusy(false);
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
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>Parental Controls</h2>

            {/* Create New Profile */}
            <div className="mb-5">
                <h3 className="text-danger mb-4 border-bottom border-secondary pb-3 fs-6 fw-bold uppercase tracking-widest">Add New Child Profile</h3>
                <form onSubmit={handleCreateChild}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="mb-0">
                                <label className="form-label mb-2" style={labelStyle}>Child Name</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter child's name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-0">
                                <label className="form-label mb-2" style={labelStyle}>Age</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="10"
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-0">
                                <label className="form-label mb-2" style={labelStyle}>Max Rating</label>
                                <select
                                    className="form-select"
                                    value={form.maxAgeRating}
                                    onChange={(e) => setForm({ ...form, maxAgeRating: e.target.value })}
                                >
                                    <option value="G">G - General</option>
                                    <option value="PG">PG - Parental Guidance</option>
                                    <option value="PG-13">PG-13</option>
                                    <option value="R">R - Restricted</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="mb-0">
                                <label className="form-label mb-2" style={labelStyle}>Allowed Genres (comma separated)</label>
                                <input
                                    className="form-control"
                                    placeholder="animation, family"
                                    value={form.allowedGenres}
                                    onChange={(e) => setForm({ ...form, allowedGenres: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn custom-red-btn px-4 py-2" disabled={busy}>
                        {busy ? 'Adding...' : 'Create Profile'}
                    </button>
                </form>
            </div>

            {/* List Profiles */}
            <div>
                <h3 className="text-danger mb-4 border-bottom border-secondary pb-3 fs-6 fw-bold uppercase tracking-widest">Active Child Profiles</h3>
                {loading ? (
                    <p className="text-secondary small">Loading profiles...</p>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {profiles.map((p) => (
                            <div key={p.id} className="p-3 rounded-card border shadow-sm" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="fw-bold mb-1 fs-6" style={{ color: 'var(--text-color)' }}>{p.name.toUpperCase()}</h5>
                                        <div className="d-flex gap-3">
                                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted-text)' }}>Age: {p.age}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted-text)' }}>Rating: {p.maxAgeRating}</span>
                                        </div>
                                        <p className="text-[11px] mt-1 mb-0 italic" style={{ color: 'var(--muted-text)' }}>Allowed: {p.allowedGenres}</p>
                                    </div>
                                    <div className="col-auto d-flex gap-2">
                                        <button
                                            className={`btn btn-sm ${activeChildId === p.id ? 'btn-warning' : 'btn-outline-success'} text-[10px] fw-bold px-0 py-1 rounded-pill`}
                                            style={{ width: '90px', height: '28px' }}
                                            onClick={() => activeChildId === p.id ? clearChildProfile() : selectChildProfile(p.id)}
                                        >
                                            {activeChildId === p.id ? 'DEACTIVATE' : 'ACTIVATE'}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger text-[10px] fw-bold px-0 py-1 rounded-pill"
                                            style={{ width: '90px', height: '28px' }}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!profiles.length && (
                            <div className="text-center py-4 rounded-card border border-dashed" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                                <p className="mb-0 small italic" style={{ color: 'var(--muted-text)' }}>No child profiles found.</p>
                            </div>
                        )}
                        {activeChildId && (
                            <div className="mt-2 text-center">
                                <button className="btn btn-link text-secondary text-[10px] fw-bold tracking-widest uppercase text-decoration-none" onClick={clearChildProfile}>
                                    Clear Active Child Session
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildManagementTab;
