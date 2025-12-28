import React from 'react';

const UserSidebar = ({ user, activeTab, onTabChange }) => {
    return (
        <div className="rounded-[24px] p-3 d-flex flex-column overflow-hidden" style={{ minHeight: '500px', backgroundColor: 'var(--background-color)' }}>
            <div className="flex flex-col items-center text-center mt-3 mb-8">
                <div
                    className="avatar custom-red rounded-circle d-flex justify-content-center align-items-center text-white mb-3 mx-auto shadow-lg"
                    style={{ width: '100px', height: '100px' }}
                >
                    <i className="bi bi-person-fill" style={{ fontSize: '3.5rem' }}></i>
                </div>
                <div>
                    <h5 className="mb-0 fw-bold tracking-tight fs-6" style={{ color: 'var(--text-color)' }}>
                        {user.firstName} {user.lastName}
                    </h5>
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                        <span className="badge bg-secondary px-2 py-0.5 text-[8px] uppercase tracking-widest rounded-pill font-bold shadow-sm">{user.role}</span>
                        {user.plan && user.plan !== 'None' && (
                            <span className="text-secondary text-[10px] font-bold uppercase tracking-widest">{user.plan}</span>
                        )}
                    </div>
                </div>
            </div>

            <nav className="nav flex-column gap-2 px-1">
                <button
                    className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'profile'
                        ? 'custom-red text-white shadow-lg'
                        : 'text-secondary border'
                        }`}
                    style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                    onClick={() => onTabChange('profile')}
                >
                    <span className="fw-bold">ACCOUNT DETAILS</span>
                </button>

                {user.role === 'admin' ? (
                    <>
                        <button
                            className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'overview' ? 'custom-red text-white shadow-lg' : 'text-secondary border'}`}
                            style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                            onClick={() => onTabChange('overview')}
                        >
                            <span className="fw-bold">SYSTEM OVERVIEW</span>
                        </button>
                        <button
                            className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'users' ? 'custom-red text-white shadow-lg' : 'text-secondary border'}`}
                            style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                            onClick={() => onTabChange('users')}
                        >
                            <span className="fw-bold">USER MANAGEMENT</span>
                        </button>
                        <button
                            className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'reviews' ? 'custom-red text-white shadow-lg' : 'text-secondary border'}`}
                            style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                            onClick={() => onTabChange('reviews')}
                        >
                            <span className="fw-bold">REVIEW MODERATION</span>
                        </button>
                        <button
                            className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'watchlist' ? 'custom-red text-white shadow-lg' : 'text-secondary border'}`}
                            style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                            onClick={() => onTabChange('watchlist')}
                        >
                            <span className="fw-bold">WATCHLIST MONITOR</span>
                        </button>
                        <button
                            className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'logs' ? 'custom-red text-white shadow-lg' : 'text-secondary border'}`}
                            style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                            onClick={() => onTabChange('logs')}
                        >
                            <span className="fw-bold">LOGS & ANALYTICS</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'subscription'
                                ? 'custom-red text-white shadow-lg'
                                : 'text-secondary border'
                                }`}
                            style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                            onClick={() => onTabChange('subscription')}
                        >
                            <span className="fw-bold">MY SUBSCRIPTION</span>
                        </button>

                        {user.role === 'parent' && (
                            <button
                                className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'children'
                                    ? 'custom-red text-white shadow-lg'
                                    : 'text-secondary border'
                                    }`}
                                style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                                onClick={() => onTabChange('children')}
                            >
                                <span className="fw-bold">CHILD MANAGEMENT</span>
                            </button>
                        )}
                    </>
                )}

                <button
                    className={`btn border-0 px-3 py-2 transition-all ${activeTab === 'settings'
                        ? 'custom-red text-white shadow-lg'
                        : 'text-secondary border'
                        }`}
                    style={{ borderRadius: '50px', letterSpacing: '0.1em', fontSize: '11px', borderColor: 'var(--border-color) !important' }}
                    onClick={() => onTabChange('settings')}
                >
                    <span className="fw-bold">PREFERENCES</span>
                </button>
            </nav>
        </div >
    );
};

export default UserSidebar;
