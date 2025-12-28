import React from 'react';
import { Users, Star, Film, Activity, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon }) => (
    <div
        className="rounded-card shadow-lg p-4
                   transition-all duration-500 group
                   hover:border-danger hover:-translate-y-1 hover:scale-[1.03]"
        style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)' }}
    >
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="custom-red p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '42px', height: '42px' }}>
                <Icon size={18} className="text-white" />
            </div>

            {change && (
                <span
                    className={`badge px-3 py-1 text-[9px] rounded-pill fw-black tracking-wider
                    ${change.startsWith('+')
                            ? 'bg-success text-white'
                            : 'bg-danger text-white'}`}
                >
                    {change}
                </span>
            )}
        </div>

        <p className="text-secondary text-[10px] fw-bold uppercase tracking-widest mb-1">
            {title}
        </p>

        <h3 className="fw-black fs-3 mb-0 group-hover:text-danger transition-colors" style={{ color: 'var(--text-color)' }}>
            {value}
        </h3>
    </div>
);

const OverviewTab = ({ stats = {} }) => {
    const changes = stats.changes || {};

    return (
        <div className="premium-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>My Dashboard</h2>

            <h3 className="text-danger mb-4 border-bottom border-secondary pb-2 fs-6 fw-bold uppercase tracking-widest">
                Platform Statistics
            </h3>

            {/* Stats Grid */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4 col-md-6">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers || 0}
                        change={changes.users || '+0%'}
                        icon={Users}
                    />
                </div>

                <div className="col-lg-4 col-md-6">
                    <StatCard
                        title="Total Reviews"
                        value={stats.totalReviews || 0}
                        change={changes.reviews || '+0%'}
                        icon={Star}
                    />
                </div>

                <div className="col-lg-4 col-md-6">
                    <StatCard
                        title="Watchlist Items"
                        value={stats.totalWatchlist || 0}
                        change={changes.watchlist || '+0%'}
                        icon={Film}
                    />
                </div>

                <div className="col-lg-4 col-md-6">
                    <StatCard
                        title="TMDB API Calls"
                        value={stats.apiCallsToday || 0}
                        change={changes.api || '0'}
                        icon={Activity}
                    />
                </div>

                <div className="col-lg-4 col-md-6">
                    <StatCard
                        title="Active Subscriptions"
                        value={stats.activeSubscriptions || 0}
                        change={changes.subs || '0'}
                        icon={TrendingUp}
                    />
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
